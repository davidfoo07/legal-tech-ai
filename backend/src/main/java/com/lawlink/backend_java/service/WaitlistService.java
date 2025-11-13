package com.lawlink.backend_java.service;

import com.lawlink.backend_java.entity.Waitlist;
import com.lawlink.backend_java.repository.WaitlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WaitlistService {
    private WaitlistRepository waitlistRepository;

    @Autowired
    public WaitlistService(WaitlistRepository waitlistRepository) {
        this.waitlistRepository = waitlistRepository;
    }


    public Waitlist signUpNewsletter(String email) {
        Waitlist waitlist = new Waitlist();
        waitlist.setEmail(email);
        return waitlistRepository.save(waitlist);
    }
    public List<Waitlist> getAllWaitlists() {
        return waitlistRepository.findAll();
    }
}
