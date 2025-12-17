package org.example.studentmanagement.service;

import org.example.studentmanagement.pojo.emp;
import org.example.studentmanagement.pojo.empQuery;
import org.example.studentmanagement.pojo.pageResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface empService {

    pageResult<emp> list(empQuery empQuery);
}
