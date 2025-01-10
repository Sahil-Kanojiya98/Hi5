package com.app.Hi5.service;

import com.app.Hi5.utility.Conversion;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Slf4j
@Service
public class IdentificationTokenService {

    private final String secretKey;
    private final long accessTokenExpirationTime;

    public IdentificationTokenService(@Value("${identification.token.secret}") String secretKey, @Value("${identification.token.expiration}") String accessTokenExpirationTimeStr) {
        this.secretKey = secretKey;
        this.accessTokenExpirationTime = Conversion.convertToMilliseconds(accessTokenExpirationTimeStr);
        log.info("IdentificationTokenService initialized with expiration time: {}", accessTokenExpirationTimeStr);
    }

    public String generateToken(String email) {
        log.info("Generating token for email: {}", email);
        Map<String, Object> claims = new HashMap<>();
        log.info("Token generated successfully for email: {}", email);
        return Jwts.builder().setClaims(claims).setSubject(email).setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + accessTokenExpirationTime)).signWith(getKey(), SignatureAlgorithm.HS256).compact();
    }

    public String extractSub(String token) {
        log.info("Extracting subject from token.");
        String subject = extractClaim(token, Claims::getSubject);
        log.info("Extracted subject: {}", subject);
        return subject;
    }

    public boolean validateToken(String token) {
        log.info("Validating token: {}", token);
        boolean isValid = !isTokenExpired(token);
        log.info("Token validation result: {}", isValid ? "Valid" : "Expired");
        return isValid;
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
    }

    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
