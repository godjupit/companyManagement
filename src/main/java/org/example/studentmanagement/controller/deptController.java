package org.example.studentmanagement.controller;

import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.annotations.Delete;
import org.example.studentmanagement.pojo.dept;
import org.example.studentmanagement.pojo.result;
import org.example.studentmanagement.service.deptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
public class deptController {


    @Autowired
    private deptService deptService;
    @GetMapping("/depts")

    public result getAllDepts(){
        //log.info("Fetching all departments");
        List<dept> deptList = deptService.list();
        return result.success(deptList);
    }


    @DeleteMapping("/depts/{id}")
    public result deleteDept(@PathVariable Integer id){
        deptService.deleteById(id);
        return result.success();

    }


    @PostMapping("/depts")
    public result addDept(@RequestBody dept dept){
        deptService.adddept(dept);
        return result.success();
    }
}
