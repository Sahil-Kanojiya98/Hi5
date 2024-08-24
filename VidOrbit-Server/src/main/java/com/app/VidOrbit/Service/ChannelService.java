package com.app.VidOrbit.Service;

import com.app.VidOrbit.DTO.Request.CreateChannelRequest;
import com.app.VidOrbit.DTO.Request.UpdateChannelRequest;
import com.app.VidOrbit.DTO.Response.CreateChannelResponse;
import com.app.VidOrbit.DTO.Response.UpdateChannelResponse;
import com.app.VidOrbit.Model.Channel;
import com.app.VidOrbit.Model.User;
import com.app.VidOrbit.Security.UserDetailsImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;


public interface ChannelService {

    CreateChannelResponse createChannel(CreateChannelRequest request, User user);

    Channel getChannelById(String id);

    UpdateChannelResponse updateChannel(UpdateChannelRequest updateRequest , User user);
}
