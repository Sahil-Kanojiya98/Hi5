package com.app.VidOrbit.Model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReactionType {
    LIKE("Like"),
    DISLIKE("Dislike");

    private final String displayName;

    @Override
    public String toString() {
        return displayName;
    }
}
