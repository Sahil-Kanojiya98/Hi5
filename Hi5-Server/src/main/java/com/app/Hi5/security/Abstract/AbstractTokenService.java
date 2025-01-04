//package com.app.Echohub.security.Abstract;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.io.Decoders;
//import io.jsonwebtoken.security.Keys;
//
//import java.security.Key;
//import java.util.Date;
//import java.util.function.Function;
//
//public abstract class AbstractTokenService implements TokenService {
//
//    protected abstract String getSecretKey();
//
//    protected abstract double getExpirationTime();
//
//    @Override
//    public String extractUserName(String token) {
//        return extractClaim(token, Claims::getSubject);
//    }
//
//    @Override
//    public boolean isTokenExpired(String token) {
//        return extractExpiration(token).before(new Date());
//    }
//
//    protected <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
//        final Claims claims = extractAllClaims(token);
//        return claimsResolver.apply(claims);
//    }
//
//    protected Claims extractAllClaims(String token) {
//        return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
//    }
//
//    protected Date extractExpiration(String token) {
//        return extractClaim(token, Claims::getExpiration);
//    }
//
//    protected Key getKey() {
//        byte[] keyBytes = Decoders.BASE64.decode(getSecretKey());
//        return Keys.hmacShaKeyFor(keyBytes);
//    }
//}
