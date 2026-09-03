package finance_tracker_api.security;

import finance_tracker_api.config.RateLimitConfig;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Servlet filter that applies rate limiting to the auth endpoints.
 *
 * <p>Each client (identified by IP) gets a token bucket; when the bucket is
 * exhausted the request is rejected with HTTP 429.</p>
 */
@Component
@Order(1)
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitConfig rateLimitConfig;

    /**
     * Creates the rate limit filter.
     *
     * @param rateLimitConfig provides the per-client token buckets
     */
    public RateLimitFilter(RateLimitConfig rateLimitConfig) {
        this.rateLimitConfig = rateLimitConfig;
    }

    /**
     * Consumes one token for auth requests and continues the chain, or
     * returns HTTP 429 when the limit is reached.
     *
     * @param request     the HTTP request
     * @param response    the HTTP response
     * @param filterChain the remaining filter chain
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Apply rate limiting only to auth endpoints
        if (path.equals("/api/auth/login") || path.equals("/api/auth/register")) {
            String key = getClientIP(request);
            Bucket bucket = rateLimitConfig.resolveBucket(key);

            ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

            if (probe.isConsumed()) {
                response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
                filterChain.doFilter(request, response);
            } else {
                response.setStatus(429); // Too Many Requests
                response.getWriter().write("{\"error\":\"Too many requests\"}");
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }

    /**
     * Resolves the client IP, honoring the {@code X-Forwarded-For} header.
     *
     * @param request the HTTP request
     * @return the client IP address
     */
    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}