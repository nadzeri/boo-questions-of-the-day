import { GetServerSideProps } from "next";

export default function Home() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination:
        "/questions/dwsQOX/what-would-you-choose-a-relationship-full-of",
      permanent: false,
    },
  };
};
