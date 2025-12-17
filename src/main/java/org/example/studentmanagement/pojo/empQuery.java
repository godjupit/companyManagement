package org.example.studentmanagement.pojo;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class empQuery {

    private Integer pageSize;
    private Long page;
    private String gender;
    private String name;      // 姓名模糊查询
    private Integer deptId;    // 部门ID筛选

    public Integer getOffset() {
        if (page == null || pageSize == null) {
            return 0;
        }
        return Math.toIntExact((page - 1) * pageSize);
    }
}
