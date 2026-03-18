import React, { useEffect, useState } from 'react';
import CrudTable from './CrudTable';

const ActivitiesManager = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Tên hoạt động' },
    { key: 'type', label: 'Loại' },
    { key: 'note', label: 'Ghi chú' }
  ];

  const fields = [
    { key: 'name', label: 'Tên hoạt động' },
    { key: 'type', label: 'Loại (model/location/program)' },
    { key: 'note', label: 'Ghi chú', type: 'textarea', required: false }
  ];

  return (
    <CrudTable
      title="Quản lý Hoạt động"
      endpoint="/api/activities"
      columns={columns}
      formFields={fields}
    />
  );
};

export default ActivitiesManager;
