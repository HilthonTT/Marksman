import { OrganizationList } from "@clerk/nextjs";

const CreateOrganizationPage = () => {
  return (
    <OrganizationList
      hidePersonal
      afterSelectOrganizationUrl="/organizations/:id"
      afterCreateOrganizationUrl="/organizations/:id"
    />
  );
};

export default CreateOrganizationPage;
