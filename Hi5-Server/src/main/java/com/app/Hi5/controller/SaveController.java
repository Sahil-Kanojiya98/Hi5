package com.app.Hi5.controller;

import com.app.Hi5.dto.request.SaveRequest;
import com.app.Hi5.model.Enum.SaveType;
import com.app.Hi5.repository.SaveRepository;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.SaveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/save")
@RequiredArgsConstructor
public class SaveController {

    private final SaveService saveService;

    @PostMapping
    public ResponseEntity<String> addSavedPost(@RequestBody SaveRequest request, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        saveService.save(userDetails.getUser(), request.getRelevantId(), request.getType());
        return new ResponseEntity<>("saved successfully!", HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<String> removeSavedPost(@RequestParam("relevantId") String relevantId, @RequestParam("type") SaveType type, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        saveService.remove(userDetails.getUser(), relevantId, type);
        return new ResponseEntity<>("unsaved successfully!", HttpStatus.OK);
    }

}
