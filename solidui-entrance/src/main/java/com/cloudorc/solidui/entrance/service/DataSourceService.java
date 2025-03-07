/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.cloudorc.solidui.entrance.service;

import com.cloudorc.solidui.dao.entity.DataSource;
import com.cloudorc.solidui.entrance.exceptions.ServiceException;
import com.cloudorc.solidui.entrance.utils.Result;

public interface DataSourceService {

    /**
     * create data source info
     * @param dataSource
     * @throws ServiceException
     */
    Result createDataSource(DataSource dataSource) throws ServiceException;
    /**
     * query data source info
     * @param dataSourceId
     * @return
     */
    Result queryDataSource(Long dataSourceId);

    Result queryDataSource(String dataSourceName);

    Result existDataSource(Long dataSourceId);

    Result queryDataSourceByPage(String dataSourceName, Long dataSourceTypeId, Boolean expire, Integer pageNo,
                                 Integer pageSize);

    Result deleteDataSource(Long dataSourceId);

    Result updateDataSource(DataSource dataSource) throws ServiceException;

}
