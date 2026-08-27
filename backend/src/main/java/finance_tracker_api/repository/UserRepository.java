package finance_tracker_api.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import finance_tracker_api.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}