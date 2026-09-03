package finance_tracker_api.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Bucket4j-based rate limiting configuration.
 *
 * <p>Keeps an in-memory token bucket per client key (by default the
 * client IP) to protect the auth endpoints against abuse.</p>
 */
@Component
public class RateLimitConfig {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Value("${rate-limiting.auth-endpoint.capacity:5}")
    private int authCapacity;

    @Value("${rate-limiting.auth-endpoint.refill-tokens:5}")
    private int authRefillTokens;

    @Value("${rate-limiting.auth-endpoint.refill-duration:60}")
    private int authRefillDuration;

    /**
     * Returns the bucket associated with a key, creating it on first
     * use.
     *
     * @param key the client identifier (e.g. an IP address)
     * @return the token bucket for that key
     */
    public Bucket resolveBucket(String key) {
        return cache.computeIfAbsent(key, k -> createNewBucket());
    }

    /**
     * Creates a fresh token bucket with the configured limits.
     *
     * @return the new bucket
     */
    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(authCapacity, Refill.greedy(authRefillTokens, Duration.ofSeconds(authRefillDuration)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Removes the bucket for a key, effectively resetting its limits.
     *
     * @param key the client identifier
     */
    public void resetBucket(String key) {
        cache.remove(key);
    }
}