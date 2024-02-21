"use client";

import { OrganizationList } from "@clerk/clerk-react";

const CreateOrganizationPage = () => {
  return (
    <OrganizationList
      hidePersonal
      afterSelectOrganizationUrl="/organization/:id"
      afterCreateOrganizationUrl="/organization/:id"
    />
  );
};

export default CreateOrganizationPage;
