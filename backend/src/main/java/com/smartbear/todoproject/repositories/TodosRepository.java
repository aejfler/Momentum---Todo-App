package com.smartbear.todoproject.repositories;
import com.smartbear.todoproject.entities.Todos;
import com.smartbear.todoproject.entities.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface TodosRepository extends CrudRepository<Todos, Long>, JpaRepository<Todos, Long> {

    @Query("SELECT t FROM Todos t ORDER BY t.duedate DESC ")
    List<Todos> findAllByDuedate();

    @Query("SELECT t FROM Todos t WHERE t.user.id = :user_id ORDER BY t.duedate DESC")
    List<Todos> findAllByDuedateAndUserId(@Param("user_id") int userId);

    List<Todos>findAllByUserOrderByPriorityAsc(User user, Sort sort);
    List<Todos>findAllByUserOrderByPriorityDesc(User user, Sort sort);
}
