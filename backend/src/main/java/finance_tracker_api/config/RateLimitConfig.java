package finance_tracker_api.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitConfig {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Value("${rate-limiting.auth-endpoint.capacity:5}")
    private int authCapacity;

    @Value("${rate-limiting.auth-endpoint.refill-tokens:5}")
    private int authRefillTokens;

    @Value("${rate-limiting.auth-endpoint.refill-duration:60}")
    private int authRefillDuration;

    public Bucket resolveBucket(String key) {
        return cache.computeIfAbsent(key, k -> createNewBucket());
    }

    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(authCapacity, Refill.greedy(authRefillTokens, Duration.ofSeconds(authRefillDuration)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    public void resetBucket(String key) {
        cache.remove(key);
    }
}