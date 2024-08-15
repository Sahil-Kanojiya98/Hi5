//package com.app.VidOrbit.Security;
//
//import com.app.VidOrbit.DTO.Response.AuthTokenRefereshResponse;
//import com.app.VidOrbit.Exceptions.InvalidOrExpiredTokenException;
//import com.app.VidOrbit.Exceptions.TokenNotFoundException;
//import com.app.VidOrbit.Model.RefreshToken;
//import com.app.VidOrbit.Model.User;
//import com.app.VidOrbit.Repository.RefreshTokenRepository;
//import com.app.VidOrbit.Repository.UserRepository;
//import com.app.VidOrbit.Security.Abstract.TokenService;
//import com.app.VidOrbit.Service.UserService;
//import com.app.VidOrbit.Utility.Conversion;
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.io.Decoders;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.security.Key;
//import java.util.Date;
//import java.util.List;
//import java.util.function.Function;
//
//@Service
//public class RefreshTokenService implements TokenService {
//
//    private final String secretKey;
//
//    @Autowired
//    private UserDetailsServiceImpl userDetailsService;
//
//    private final double rotationThreshold;
//    private final double refreshTokenExpirationTime;
//
//    public RefreshTokenService(
//            @Value("${vidorbit.token.refresh.secret}") String secretKey,
//            @Value("${vidorbit.token.refresh.rotation_threshold}") String rotationThresholdStr,
//            @Value("${vidorbit.token.refresh.expiration}") String refreshTokenExpirationTimeStr
//    ) {
//        this.secretKey=secretKey;
//        this.rotationThreshold = Conversion.convertToMilliseconds(rotationThresholdStr);
//        this.refreshTokenExpirationTime = Conversion.convertToMilliseconds(refreshTokenExpirationTimeStr);
//        System.out.println("secretKey = " + secretKey);
//        System.out.println("rotationThreshold = " + rotationThreshold);
//        System.out.println("refreshTokenExpirationTime = " + refreshTokenExpirationTime);
//    }
//
//    @Autowired
//    private AuthenticationTokenServiceImpl authenticationTokenService;
//
//    @Autowired
//    private RefreshTokenRepository refreshTokenRepository;
//
//    @Autowired
//    private UserService userService;
//
//    @Override
//    @Transactional
//    public String generateToken(String username) {
//        Date date = new Date(System.currentTimeMillis() + (long) refreshTokenExpirationTime );
//        // Generate a refresh token
//        String token = Jwts.builder()
//                .setSubject(username)
//                .setIssuedAt(new Date())
//                .setExpiration(date)
//                .signWith(getKey(), SignatureAlgorithm.HS256)
//                .compact();
//        return token;
//    }
//
//    @Override
//    public String extractUserName(String token) {
//        return extractClaim(token, Claims::getSubject);
//    }
//
//    public boolean validateToken(String token, UserDetails userDetails) {
//        List<RefreshToken> refreshTokens = refreshTokenRepository
//                .findByUsername(userDetails.getUsername())
//                .orElseThrow(()->new TokenNotFoundException("The provided refresh token is not found"));
//        return ( (refreshTokens.stream().anyMatch(refreshToken -> refreshToken.getToken().equals(token)) ) && !isTokenExpired(token) );
//    }
//
//    private Key getKey() {
//        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
//        return Keys.hmacShaKeyFor(keyBytes);
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
//    public boolean isTokenExpired(String token) {
//        return extractExpiration(token).before(new Date());
//    }
//
//    private Date extractExpiration(String token) {
//        return extractClaim(token, Claims::getExpiration);
//    }
//
//    @Transactional
//    public AuthTokenRefereshResponse generateAuthTokenAndRotateRefreshToken(String refreshToken) {
//        AuthTokenRefereshResponse response=new AuthTokenRefereshResponse();
//        UserDetails userDetails = userDetailsService.loadUserByUsername(extractUserName(refreshToken));
//        if (validateToken(refreshToken,userDetails)){
//            if (isTokenExpiringSoon(refreshToken)){
//                User user=userService.getUserByEmail(userDetails.getUsername());
//                user.getRefreshToken().removeIf(refresh -> refresh.getExpiryDate().before(new Date()));  //remove expired tokens from user
//                user.getRefreshToken().removeIf((token)->token.getToken().equals(refreshToken));         //remove the expirable token from user
//                refreshTokenRepository.deleteByToken(refreshToken);
//                userService.persist(user);
//                response.setRefreshToken(generateToken(userDetails.getUsername()));
//            }
//            response.setAccessToken(authenticationTokenService.generateToken(userDetails.getUsername()));
//            return response;
//        }else{
//            throw new InvalidOrExpiredTokenException("The provided refresh token is either invalid or has expired.");
//        }
//    }
//
//    public boolean isTokenExpiringSoon(String token) {
//        Date expirationDate = extractExpiration(token);
//        Date now = new Date();
//        long timeUntilExpiration = expirationDate.getTime() - now.getTime();
//        return timeUntilExpiration <= rotationThreshold;
//    }
//}

package com.app.VidOrbit.Security;

import com.app.VidOrbit.DTO.Response.AuthTokenRefereshResponse;
import com.app.VidOrbit.Exceptions.InvalidOrExpiredTokenException;
import com.app.VidOrbit.Exceptions.TokenNotFoundException;
import com.app.VidOrbit.Model.RefreshToken;
import com.app.VidOrbit.Model.User;
import com.app.VidOrbit.Repository.RefreshTokenRepository;
import com.app.VidOrbit.Security.Abstract.AbstractTokenService;
import com.app.VidOrbit.Service.UserService;
import com.app.VidOrbit.Utility.Conversion;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class RefreshTokenService extends AbstractTokenService {

    private final String secretKey;
    private final double rotationThreshold;
    private final double refreshTokenExpirationTime;

    @Autowired
    private UserService userService;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private AuthenticationTokenServiceImpl authenticationTokenService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    public RefreshTokenService(
            @Value("${vidorbit.token.refresh.secret}") String secretKey,
            @Value("${vidorbit.token.refresh.rotation_threshold}") String rotationThresholdStr,
            @Value("${vidorbit.token.refresh.expiration}") String refreshTokenExpirationTimeStr
    ) {
        this.secretKey = secretKey;
        this.rotationThreshold = Conversion.convertToMilliseconds(rotationThresholdStr);
        this.refreshTokenExpirationTime = Conversion.convertToMilliseconds(refreshTokenExpirationTimeStr);
    }

    @Override
    protected String getSecretKey() {
        return secretKey;
    }

    @Override
    protected double getExpirationTime() {
        return refreshTokenExpirationTime;
    }

    @Override
    @Transactional
    public String generateToken(String username) {
        Date date = new Date(System.currentTimeMillis() + (long) refreshTokenExpirationTime);
        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(date)
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
        RefreshToken refreshToken = RefreshToken.builder().expiryDate(date).username(username).token(token).build();
        refreshTokenRepository.save(refreshToken);
        User user=userService.getUserByEmail(username);
        user.getRefreshToken().add(refreshToken);
        System.out.println("upper :"+user.getRefreshToken().size());
        userService.persist(user);
        return token;
    }

    @Override
    public boolean validateToken(String token, String username) {
        List<RefreshToken> refreshTokens = refreshTokenRepository
                .findByUsername(username)
                .orElseThrow(() -> new TokenNotFoundException("The provided refresh token is not found"));
        return refreshTokens.stream().anyMatch(refreshToken -> refreshToken.getToken().equals(token)) && !isTokenExpired(token);
    }

    @Transactional
    public AuthTokenRefereshResponse generateAuthTokenAndRotateRefreshToken(String refreshToken) {
        System.out.println("refresh called");
        UserDetails userDetails = userDetailsService.loadUserByUsername(extractUserName(refreshToken));
        AuthTokenRefereshResponse response = new AuthTokenRefereshResponse();
        if (validateToken(refreshToken, userDetails.getUsername())) {
            if (isTokenExpiringSoon(refreshToken)) {
                System.out.println("expirable "+refreshToken);
                User user = userService.getUserByEmail(userDetails.getUsername());
                List<RefreshToken> tokens=user.getRefreshToken();
                System.out.println(tokens.size());
                user.getRefreshToken().removeIf(refresh -> {
                    boolean isExpired = refresh.getExpiryDate().before(new Date());
                    boolean isMatchingToken = refresh.getToken().equals(refreshToken);
                    if (isExpired || isMatchingToken) {
                        System.out.println("removing " + refresh);
                        refreshTokenRepository.delete(refresh);
                        return true;
                    } else {
                        return false;
                    }
                });
                userService.persist(user);
                response.setRefreshToken(generateToken(userDetails.getUsername()));
            }
            response.setAccessToken(authenticationTokenService.generateToken(userDetails.getUsername()));
            return response;
        } else {
            throw new InvalidOrExpiredTokenException("The provided refresh token is either invalid or has expired.");
        }
    }

    private boolean isTokenExpiringSoon(String token) {
        Date expirationDate = extractExpiration(token);
        Date now = new Date();
        long timeUntilExpiration = expirationDate.getTime() - now.getTime();
        return timeUntilExpiration <= rotationThreshold;
    }
}
