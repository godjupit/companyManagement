package org.example.studentmanagement.mapper;


import org.apache.ibatis.annotations.*;
import org.example.studentmanagement.pojo.dept;

import java.util.List;

@Mapper
public interface deptMapper {

    // 查询所有部门，显式列出字段名，便于与实体映射
    @Select("select id, name, create_time as createTime, update_time as updateTime from dept")
    List<dept> list();


    // 新增部门：假设 id 为自增主键，只插入 name 和时间字段
    @Options(useGeneratedKeys = true, keyProperty = "id")
    @Insert("insert into dept(name, create_time, update_time) values(#{name}, #{createTime}, #{updateTime})")
    void adddept(dept dept);


    // 根据 id 删除部门
    @Delete("delete from dept where id = #{id}")
    void deleteById(Integer id);
}
