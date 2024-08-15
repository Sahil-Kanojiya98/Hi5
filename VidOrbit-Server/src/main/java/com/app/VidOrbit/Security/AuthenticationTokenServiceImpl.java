//package com.app.VidOrbit.Security;
//
//import com.app.VidOrbit.Security.Abstract.TokenService;
//import com.app.VidOrbit.Utility.Conversion;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.io.Decoders;
//import io.jsonwebtoken.security.Keys;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Service;
//
//import java.security.Key;
//import java.util.Date;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.function.Function;
//
//@Service
//public class AuthenticationTokenServiceImpl implements TokenService {
//
//    private final String secretKey;
//
//    private final double accessTokenExpirationTime;
//
//    public AuthenticationTokenServiceImpl (
//            @Value("${vidorbit.token.access.expiration}") String accessTokenExpirationTimeStr,
//            @Value("${vidorbit.token.access.secret}") String secretKey
//    ) {
//        this.accessTokenExpirationTime = Conversion.convertToMilliseconds(accessTokenExpirationTimeStr);
//        this.secretKey=secretKey;
//        System.out.println("secretKey = " + secretKey);
//        System.out.println("accessTokenExpirationTime = " + accessTokenExpirationTime);
//    }
//
//    public String generateToken(String username) {
//        Map<String, Object> claims = new HashMap<>();
//        return Jwts.builder()
//                .setClaims(claims)
//                .setSubject(username)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + (long) (accessTokenExpirationTime)))
//                .signWith(getKey(), SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    private Key getKey() {
//        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
//        return Keys.hmacShaKeyFor(keyBytes);
//    }
//
//    @Override
//    public String extractUserName(String token) {
//        return extractClaim(token, Claims::getSubject);
//    }
//
//    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
//        final Claims claims = extractAllClaims(token);
//        return claimsResolver.apply(claims);
//    }
//
//    private Claims extractAllClaims(String token) {
//        return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
//    }
//
//    public boolean validateToken(String token, UserDetails userDetails) {
//        final String userName = extractUserName(token);
//        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
//    }
//
//    @Override
//    public boolean isTokenExpired(String token) {
//        return extractExpiration(token).before(new Date());
//    }
//
//    private Date extractExpiration(String token) {
//        return extractClaim(token, Claims::getExpiration);
//    }
//
//}


package com.app.VidOrbit.Security;

import com.app.VidOrbit.Security.Abstract.AbstractTokenService;
import com.app.VidOrbit.Utility.Conversion;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthenticationTokenServiceImpl extends AbstractTokenService {

    private final String secretKey;
    private final double accessTokenExpirationTime;

    public AuthenticationTokenServiceImpl (
            @Value("${vidorbit.token.access.expiration}") String accessTokenExpirationTimeStr,
            @Value("${vidorbit.token.access.secret}") String secretKey
    ) {
        this.secretKey = secretKey;
        this.accessTokenExpirationTime = Conversion.convertToMilliseconds(accessTokenExpirationTimeStr);
    }

    @Override
    protected String getSecretKey() {
        return secretKey;
    }

    @Override
    protected double getExpirationTime() {
        return accessTokenExpirationTime;
    }

    @Override
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + (long) accessTokenExpirationTime))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public boolean validateToken(String token, String username) {
        return extractUserName(token).equals(username) && !isTokenExpired(token);
    }
}
