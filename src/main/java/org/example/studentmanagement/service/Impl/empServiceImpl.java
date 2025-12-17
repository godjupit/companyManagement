package org.example.studentmanagement.service.Impl;

import org.example.studentmanagement.mapper.empMapper;
import org.example.studentmanagement.pojo.emp;
import org.example.studentmanagement.pojo.empQuery;
import org.example.studentmanagement.pojo.pageResult;
import org.example.studentmanagement.service.empService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class empServiceImpl implements empService {
    @Autowired
    private empMapper empMapper;

   @Override
    public pageResult<emp> list(empQuery empQuery) {

        List<emp> empList = empMapper.page(empQuery);
        Long total = empMapper.count(empQuery);
        return new pageResult<>(empList, total);
    }



}
