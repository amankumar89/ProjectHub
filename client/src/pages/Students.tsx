import styled from "styled-components";
import BackButton from "@/components/BackButton";

const Students: React.FC = () => {
  return (
    <Wrapper>
      <Header>
        <Title>Students</Title>
      </Header>
      <Card>
        <Empty>Student list will appear here.</Empty>
      </Card>
      <BackButton />
    </Wrapper>
  );
};

export default Students;

const Wrapper = styled.div.attrs({
  className: "min-h-screen bg-gray-50",
})``;
const Header = styled.div.attrs({
  className: "flex items-center gap-3 mb-8",
})``;

const Title = styled.h1.attrs({
  className: "text-3xl font-bold text-gray-800",
})``;
const Card = styled.div.attrs({
  className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6",
})``;
const Empty = styled.p.attrs({ className: "text-gray-400 text-sm" })``;
