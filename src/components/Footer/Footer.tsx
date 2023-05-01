import { IconButton, useColorMode } from "@chakra-ui/react";
import styles from "./footer.module.css";

export type footerProps = {};

const Footer = (props: footerProps) => {
  return (
    <div className={styles.container}>
      <>@ 2023 aiSEI Ltd</>
    </div>
  );
};

export default Footer;
