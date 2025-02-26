package com.app.Hi5.controller;

import com.app.Hi5.dto.payload.MessagePayload;
import com.app.Hi5.model.Message;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.UserRepository;
import com.app.Hi5.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Slf4j
@Controller
@RequestMapping("/api/message")
@RequiredArgsConstructor
public class MessageController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageService messageService;
    private final UserRepository userRepository;

    @MessageMapping("/message")
    public void processMessage(@Payload MessagePayload messagePayload) {

        Message savedMsg = messageService.save(messagePayload.getChatId(), messagePayload.getImageUrl(), messagePayload.getVideoUrl(), messagePayload.getMessage(), messagePayload.getSenderId());
        Optional<User> optionalUser = userRepository.findById(new ObjectId(messagePayload.getSenderId()));
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Map<String, Object> chatMessageData = new HashMap<>(Map.of(
                    "id", savedMsg.getId().toHexString(),
                    "chatId", savedMsg.getChatId(),
                    "message", savedMsg.getMessage(),
                    "createdAt", savedMsg.getCreatedAt(),
                    "senderUserId", user.getId().toHexString(),
                    "senderUsername", user.getUsername(),
                    "senderFullname", user.getFullname(),
                    "senderProfileImageUrl", user.getProfileImageUrl()
            ));
            Optional.ofNullable(savedMsg.getImageUrl()).ifPresent(url -> chatMessageData.put("imageUrl", url));
            Optional.ofNullable(savedMsg.getVideoUrl()).ifPresent(url -> chatMessageData.put("videoUrl", url));
            simpMessagingTemplate.convertAndSend("/chat/" + messagePayload.getReceiverId(), chatMessageData);
        }

        Map<String, Object> messageData = new HashMap<>(Map.of(
                "id", savedMsg.getId().toHexString(),
                "chatId", savedMsg.getChatId(),
                "message", savedMsg.getMessage(),
                "createdAt", savedMsg.getCreatedAt(),
                "createdByUserId", messagePayload.getSenderId()
        ));
        Optional.ofNullable(savedMsg.getImageUrl()).ifPresent(url -> messageData.put("imageUrl", url));
        Optional.ofNullable(savedMsg.getVideoUrl()).ifPresent(url -> messageData.put("videoUrl", url));
        simpMessagingTemplate.convertAndSend("/message/" + messagePayload.getReceiverId() + "/" + messagePayload.getSenderId(), messageData);
    }

    @ResponseBody
    @GetMapping("/{chatId}")
    @PreAuthorize("principal.isAccountNonLocked()")
    public ResponseEntity<List<Message>> findChatMessages(@PathVariable String chatId) {
        List<Message> response = messageService.getMessagesByChatId(chatId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
