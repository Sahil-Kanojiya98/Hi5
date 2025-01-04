//package com.app.Echohub.filter;
//
//import com.app.Echohub.security.AuthenticationTokenServiceImpl;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Service;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//
//@Service
//public class AuthTokenFilter extends OncePerRequestFilter {
//
//    @Autowired
//    private AuthenticationTokenServiceImpl authTokenService;
//
//    @Autowired
//    private UserDetailsService userDetailsService;
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//        logger.debug("request started");
////        fetches authorization header
//        System.out.println(0);
//        String authHeader = request.getHeader("Authorization");
//        String token = null;
//        String userName = null;
//
//        System.out.println(1);
////        if bearer is valid then extract username
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            token = authHeader.substring(7);
//            userName = authTokenService.extractUserName(token);
//        }
//
//        System.out.println(2);
////        if token is valid then set the authentication
//        if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//            UserDetails userDetails = userDetailsService.loadUserByUsername(userName);
//            if (authTokenService.validateToken(token, userDetails.getUsername())) {
//                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                SecurityContextHolder.getContext().setAuthentication(authToken);
//            }
//        }
//
//        System.out.println("3");
////        continue
//        filterChain.doFilter(request, response);
//    }
//}
