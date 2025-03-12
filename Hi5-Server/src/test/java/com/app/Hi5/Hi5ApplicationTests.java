package com.app.Hi5;

import com.app.Hi5.model.Chat;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.ChatRepository;
import com.app.Hi5.repository.PostRepository;
import com.app.Hi5.repository.ReelRepository;
import com.app.Hi5.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
class Hi5ApplicationTests {

    @Test
    void contextLoads() {
    }

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ReelRepository reelRepository;

    @Test
    void testFindByChatUserIdsAtSpecificPositions() {
//        Optional<Chat> chat1 = chatRepository.findByChatUserIdsContaining("67bc6b93dd2cc8596bb21e97", "67bc6b93dd2cc8596bb21e97");
////        Optional<Chat> chat1 = chatRepository.findByChatUserIdsContaining("67bc6a8bdd2cc8596bb21e91", "67bc6b93dd2cc8596bb21e97");
//        assertThat(chat1).isPresent();

//        userRepository.saveAll(userRepository.findAll());
//        postRepository.saveAll(postRepository.findAll());
//        reelRepository.saveAll(reelRepository.findAll());


    }

}
