package com.zl.mjga.repository;

import static org.jooq.generated.mjga.tables.UserRoleMap.USER_ROLE_MAP;

import java.util.List;
import org.jooq.Configuration;
import org.jooq.generated.mjga.tables.daos.UserRoleMapDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class UserRoleMapRepository extends UserRoleMapDao {

  @Autowired
  public UserRoleMapRepository(Configuration configuration) {
    super(configuration);
  }

  @Transactional
  public void deleteByUserId(Long userId) {
    ctx().deleteFrom(USER_ROLE_MAP).where(USER_ROLE_MAP.USER_ID.eq(userId)).execute();
  }

  @Transactional
  public void deleteBy(Long userId, List<Long> roleIdList) {
    ctx()
        .deleteFrom(USER_ROLE_MAP)
        .where(USER_ROLE_MAP.USER_ID.eq(userId))
        .and(USER_ROLE_MAP.ROLE_ID.in(roleIdList))
        .execute();
  }
}
