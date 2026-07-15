import { Button, Col, Input, Row } from "antd";
import { PageTitle } from "../common/PageTitle";
import { PlusOutlined, SearchOutlined } from "../icons";
import Helper from "@/helper";
import { useRouter, useSearchParams } from "@/router";

// INTERFACE
interface DataTableProps {
   title: string;
   addNewTitle: string;
}

const withDataTable = (props: DataTableProps) => {
   function Page() {

      const instance = Helper.getInstance();
      const router = useRouter();
      const searchParams = useSearchParams();
      let timer: any = null;

      const onSearch = (event: any) => {
         const search = event.target.value;
         const { option, queryParams } = instance.appendFilterParams(searchParams, 'search', search);
   
         clearTimeout(timer);
         timer = setTimeout(() => {
            router.push(`?${queryParams}`);
         }, 1200);
     };

      return <Row gutter={[16, 16]}>
         <Col sm={24} md={6} xl={6}>
            <PageTitle title={props.title} />
         </Col>

         <Col sm={24} md={18} xl={18} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Input placeholder="Search..." style={{ width: 200, marginRight: 15 }} prefix={<SearchOutlined />} allowClear onChange={onSearch} />
            <Button type="primary" icon={<PlusOutlined />}>
                  Add New
            </Button>
            {/* <QuarterForm reload={fetchData} ref={ref} /> */}
         </Col>

      </Row>
   }
}

export default withDataTable;