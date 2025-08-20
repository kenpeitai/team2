package com.example.demo.repository;

import com.example.demo.entity.NeedsListItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NeedsListItemRepository extends JpaRepository<NeedsListItem, Long> {
    
    List<NeedsListItem> findByNeedsListId(Long needsListId);
    
    void deleteByNeedsListId(Long needsListId);
}
