// Chakra imports
import { Box, Grid } from "@chakra-ui/react";

// Custom components
import Banner from "views/admin/profile/components/Banner";
import General from "views/admin/profile/components/General";
import Notifications from "views/admin/profile/components/Notifications";
import Projects from "views/admin/profile/components/Projects";
import ProviderTab from "views/admin/profile/components/ProviderTab";
import DemanderTab from "views/admin/profile/components/DemanderTab";

// Assets
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar4.png";
import React, { useEffect, useState } from "react";

export default function Overview() {
  const [userName, setUserName] = useState("");
  const [roleUser, setroleUser] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user.fullname);
      setroleUser(user.role);
    }
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        mb="20px"
        templateColumns={{
          base: "1fr",
          lg: "32.5% 67.5%",
        }}
        templateRows={{
          base: "repeat(2, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
      >

        <Banner
          gridArea="1 / 1 / 2 / 2"
          banner={banner}
          avatar={avatar}
          name={userName} // Updated to use userName from state
          job={roleUser}
          posts="17"
          followers="9.7k"
          following="274"
        />
        <General gridArea="1 / 2 / 2 / 3" minH="365px" pe="20px" />
        <General gridArea="1 / 2 / 2 / 3" minH="365px" pe="20px" />
      </Grid>
      <Grid
        mb="20px"
        templateColumns={{
          base: "1fr",
          lg: "1fr",
        }}
        templateRows={{
          base: "1fr",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <ProviderTab />
      </Grid>
      <Grid
        mb="20px"
        templateColumns={{
          base: "1fr",
          lg: "1fr",
        }}
        templateRows={{
          base: "1fr",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <ProviderTab />
      </Grid>
      <Grid
        mb="20px"
        templateColumns={{
          base: "1fr",
          lg: "1fr",
        }}
        templateRows={{
          base: "1fr",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <DemanderTab />
      </Grid>
      <Grid
        mb="20px"
        templateColumns={{
          base: "1fr",
          lg: "1fr",
        }}
        templateRows={{
          base: "1fr",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <DemanderTab />
      </Grid>
      <Grid
        mb="20px"
        templateColumns={{
          base: "1fr",
          lg: "1fr",
        }}
        templateRows={{
          base: "1fr",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <Projects
          gridArea="1 / 1 / 2 / 2"
          banner={banner}
          avatar={avatar}
          name="Adela Parkson"
          job="Product Designer"
          posts="17"
          followers="9.7k"
          following="274"
        />
      </Grid>
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1fr",
        }}
        templateRows={{
          base: "1fr",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <Notifications used={25.6} total={50} gridArea="1 / 1 / 2 / 2" />
      </Grid>
    </Box>
  );
}
