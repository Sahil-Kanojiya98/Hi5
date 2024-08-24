package com.app.VidOrbit.Model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Category {

    EXPLORE("Explore"),
    TRENDING("Trending"),
    SHOPPING("Shopping"),
    MUSIC("Music"),
    FILMS("Films"),
    GAMING("Gaming"),
    NEWS("News"),
    SPORT("Sport"),
    COURSES("Courses"),
    FASHION_AND_BEAUTY("Fashion & Beauty"),
    PODCASTS("Podcasts"),
    OTHER("Other");

    private final String displayName;

    @Override
    public String toString() {
        return displayName;
    }

}
