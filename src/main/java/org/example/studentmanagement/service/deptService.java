package org.example.studentmanagement.service;


import org.example.studentmanagement.pojo.dept;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface deptService {

    /**
     * @description: Fetch all departments
     * @return: List of departments
     */
    List<dept> list();

    void deleteById(Integer id);
    
    void adddept(dept dept);
}
