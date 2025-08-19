package com.example.demo.service;

import com.example.demo.dto.ShelterDto;
import com.example.demo.entity.Shelter;
import com.example.demo.entity.UtilityStatus;
import com.example.demo.entity.TrafficStatus;
import com.example.demo.repository.ShelterRepository;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.DuplicateResourceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ShelterService {
    
    @Autowired
    private ShelterRepository shelterRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // 避難所登録
    public Shelter createShelter(ShelterDto shelterDto) {
        // メールアドレスの重複チェック
        if (shelterRepository.existsByEmail(shelterDto.getEmail())) {
            throw new DuplicateResourceException("このメールアドレスは既に登録されています");
        }
        
        // 避難所名の重複チェック
        if (shelterRepository.existsByShelterName(shelterDto.getShelterName())) {
            throw new DuplicateResourceException("この避難所名は既に登録されています");
        }
        
        Shelter shelter = new Shelter();
        shelter.setShelterName(shelterDto.getShelterName());
        shelter.setShelterAddress(shelterDto.getShelterAddress());
        shelter.setRepresentativeLastName(shelterDto.getRepresentativeLastName());
        shelter.setRepresentativeFirstName(shelterDto.getRepresentativeFirstName());
        shelter.setPhoneNumber(shelterDto.getPhoneNumber());
        shelter.setEmail(shelterDto.getEmail());
        shelter.setPassword(passwordEncoder.encode(shelterDto.getPassword()));
        shelter.setEvacueeCount(shelterDto.getEvacueeCount());
        shelter.setInjuredCount(shelterDto.getInjuredCount());
        shelter.setElectricityStatus(shelterDto.getElectricityStatus());
        shelter.setGasStatus(shelterDto.getGasStatus());
        shelter.setWaterStatus(shelterDto.getWaterStatus());
        shelter.setTrafficStatus(shelterDto.getTrafficStatus());
        
        return shelterRepository.save(shelter);
    }
    
    // 避難所情報更新
    public Shelter updateShelterStatus(Long id, ShelterDto shelterDto) {
        Shelter shelter = shelterRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("避難所が見つかりません: " + id));
        
        // 状況情報のみ更新
        shelter.setEvacueeCount(shelterDto.getEvacueeCount());
        shelter.setInjuredCount(shelterDto.getInjuredCount());
        shelter.setElectricityStatus(shelterDto.getElectricityStatus());
        shelter.setGasStatus(shelterDto.getGasStatus());
        shelter.setWaterStatus(shelterDto.getWaterStatus());
        shelter.setTrafficStatus(shelterDto.getTrafficStatus());
        
        return shelterRepository.save(shelter);
    }
    
    // 避難所情報取得
    public Shelter getShelterById(Long id) {
        return shelterRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("避難所が見つかりません: " + id));
    }
    
    // 全避難所取得
    public List<Shelter> getAllShelters() {
        return shelterRepository.findByIsActiveTrue();
    }
    
    // 避難所検索
    public List<Shelter> searchShelters(String shelterName, String address, Boolean isActive) {
        return shelterRepository.searchShelters(shelterName, address, isActive);
    }
    
    // 避難所名で検索
    public List<Shelter> searchByShelterName(String shelterName) {
        return shelterRepository.findByShelterNameContainingIgnoreCase(shelterName);
    }
    
    // 住所で検索
    public List<Shelter> searchByAddress(String address) {
        return shelterRepository.findByShelterAddressContainingIgnoreCase(address);
    }
    
    // 代表者名で検索
    public List<Shelter> searchByRepresentativeName(String lastName, String firstName) {
        return shelterRepository.findByRepresentativeLastNameContainingIgnoreCaseOrRepresentativeFirstNameContainingIgnoreCase(
            lastName, firstName);
    }
    
    // 避難者数で検索
    public List<Shelter> searchByEvacueeCount(Integer count) {
        return shelterRepository.findByEvacueeCountGreaterThan(count);
    }
    
    // けが人数で検索
    public List<Shelter> searchByInjuredCount(Integer count) {
        return shelterRepository.findByInjuredCountGreaterThan(count);
    }
    
    // 避難所削除（論理削除）
    public void deleteShelter(Long id) {
        Shelter shelter = getShelterById(id);
        shelter.setIsActive(false);
        shelterRepository.save(shelter);
    }
    
    // 避難所認証
    public Optional<Shelter> authenticateShelter(String email, String password) {
        Optional<Shelter> shelterOpt = shelterRepository.findByEmail(email);
        if (shelterOpt.isPresent()) {
            Shelter shelter = shelterOpt.get();
            if (passwordEncoder.matches(password, shelter.getPassword())) {
                return Optional.of(shelter);
            }
        }
        return Optional.empty();
    }
}
