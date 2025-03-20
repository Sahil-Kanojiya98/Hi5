package com.app.Hi5.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatsResponse {

    @Builder.Default
    private List<String> x=new ArrayList<>();
    @Builder.Default
    private List<Long> y=new ArrayList<>();

}
