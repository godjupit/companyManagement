package org.example.studentmanagement.service.Impl;

import org.example.studentmanagement.mapper.deptMapper;
import org.example.studentmanagement.pojo.dept;
import org.example.studentmanagement.service.deptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
public class deptServiceImpl implements deptService {

    @Autowired
    private deptMapper deptmapper;
    @Override
    public List<dept> list(){
        return deptmapper.list();
    }



    @Override
    public void deleteById(Integer id) {
        deptmapper.deleteById(id);
        return;
    }


    @Override
    public void adddept(dept dept) {
        dept.setCreateTime(LocalDateTime.now());
        dept.setUpdateTime(LocalDateTime.now());
        deptmapper.adddept(dept);
    }

}
