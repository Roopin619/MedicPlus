import React, { useEffect, useState, useContext } from "react";
import Grid from "@material-ui/core/Grid";
import Zoom from "@material-ui/core/Zoom";

import Card from "./Card";
import useStyles from "../../styles/CardListStyles";
import { DataContext } from "../../context/data.context";
import { AttributeContext } from "../../context/attribute.context";
import { colors } from "../../constants";

function Cards() {
  const classes = useStyles();
  const data = useContext(DataContext);
  const attribute = useContext(AttributeContext);

  const [cardData, setCardData] = useState({
    confirmed: {
      total: "---",
      delta: "---",
    },
    active: {
      total: "---",
    },
    recovered: {
      total: "---",
      delta: "---",
    },
    deceased: {
      total: "---",
      delta: "---",
    },
    tested: {
      total: "---",
      delta: "---",
    },
    vaccinated1: {
      total: "---",
      delta: "---",
    },
    vaccinated2: {
      total: "---",
      delta: "---",
    }
  });

  useEffect(() => {
    if (!data.hasLoaded) {
      return;
    }
    setCardData({
      confirmed: {
        total: data.indiaData.total.confirmed.toLocaleString("en-IN"),
        delta: data.indiaData?.delta?.confirmed
          ? "+" + data.indiaData.delta.confirmed.toLocaleString("en-IN")
          : "♥",
      },
      active: {
        total: data.indiaData.total.active.toLocaleString("en-IN"),
      },
      recovered: {
        total: data.indiaData.total.recovered.toLocaleString("en-IN"),
        delta: data.indiaData?.delta?.recovered
          ? "+" + data.indiaData.delta.recovered.toLocaleString("en-IN")
          : "♥",
      },
      deceased: {
        total: data.indiaData.total.deceased.toLocaleString("en-IN"),
        delta: data.indiaData?.delta?.deceased
          ? "+" + data.indiaData.delta.deceased.toLocaleString("en-IN")
          : "♥",
      },
      tested: {
        total: data.indiaData.total.tested.toLocaleString("en-IN"),
        delta: data.indiaData?.delta?.tested
          ? "+" + data.indiaData.delta.tested.toLocaleString("en-IN")
          : "-",
      },
      vaccinated1: {
        total: data.indiaData.total.vaccinated1.toLocaleString("en-IN"),
        delta: data.indiaData?.delta?.vaccinated1
          ? "+" + data.indiaData.delta.vaccinated1.toLocaleString("en-IN")
          : "-",
      },
      vaccinated2: {
        total: data.indiaData.total.vaccinated2.toLocaleString("en-IN"),
        delta: data.indiaData?.delta?.vaccinated2
          ? "+" + data.indiaData.delta.vaccinated2.toLocaleString("en-IN")
          : "-",
      },
    });
  }, [data]);

  if (!data.hasLoaded) {
    return <div>Loading</div>;
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={0}>
        <Zoom in={true} style={{ transitionDelay: "50ms" }}>
          <Grid item xs={3}>
            <Card
              active={attribute === "confirmed"}
              type="confirmed"
              heading="Confirmed"
              subHeading={cardData.confirmed.delta}
              number={cardData.confirmed.total}
              bgColor={"rgba(255, 87, 123, 0.1)"}
              hoverColor={"rgba(255, 87, 123, 0.15)"}
              fontColor={colors.red}
              fontColorTransparent={colors.redTransparent}
            />
          </Grid>
        </Zoom>
        <Zoom in={true} style={{ transitionDelay: "100ms" }}>
          <Grid item xs={3}>
            <Card
              active={attribute === "active"}
              type="active"
              heading="Active"
              subHeading="-"
              number={cardData.active.total}
              bgColor={"rgba(46, 120, 223, 0.1)"}
              hoverColor={"rgba(46, 120, 223, 0.2)"}
              fontColor={colors.blue}
              fontColorTransparent={colors.blueTransparent}
            />
          </Grid>
        </Zoom>
        <Zoom in={true} style={{ transitionDelay: "200ms" }}>
          <Grid item xs={3}>
            <Card
              active={attribute === "recovered"}
              type="recovered"
              heading="Recovered"
              subHeading={cardData.recovered.delta}
              number={cardData.recovered.total}
              bgColor={"rgba(40, 167, 69,0.1)"}
              hoverColor={"rgba(40, 167, 69,0.2)"}
              fontColor={colors.green}
              fontColorTransparent={colors.greenTransparent}
            />
          </Grid>
        </Zoom>
        <Zoom in={true} style={{ transitionDelay: "300ms" }}>
          <Grid item xs={3}>
            <Card
              active={attribute === "deceased"}
              type="deceased"
              heading="Deceased"
              subHeading={cardData.deceased.delta}
              number={cardData.deceased.total}
              bgColor={"rgba(193, 193, 193, 0.1)"}
              hoverColor={"rgba(193, 193, 193, 0.2)"}
              fontColor={colors.grey}
              fontColorTransparent={colors.greyTransparent}
            />
          </Grid>
        </Zoom>
        <Zoom in={true} style={{ transitionDelay: "200ms" }}>
          <Grid item xs={3}>
            <Card
              active={attribute === "tested"}
              type="tested"
              heading="Tested"
              subHeading={cardData.tested.delta}
              number={cardData.tested.total}
              bgColor={"rgba(196, 0, 255, 0.1)"}
              hoverColor={"rgba(196, 0, 255, 0.15)"}
              fontColor={colors.purple}
              fontColorTransparent={colors.purpleTransparent}
            />
          </Grid>
        </Zoom>
        <Zoom in={true} style={{ transitionDelay: "200ms" }}>
          <Grid item xs={3}>
            <Card
              active={attribute === "vaccinated1"}
              type="vaccinated1"
              heading="Vaccinated1"
              subHeading={cardData.vaccinated1.delta}
              number={cardData.vaccinated1.total}
              bgColor={"rgba(255, 130, 67, 0.1)"}
              hoverColor={"rgba(255, 130, 67, 0.15)"}
              fontColor={colors.orange}
              fontColorTransparent={colors.orangeTransparent}
            />
          </Grid>
        </Zoom>
        <Zoom in={true} style={{ transitionDelay: "200ms" }}>
          <Grid item xs={3}>
            <Card
              active={attribute === "vaccinated2"}
              type="vaccinated2"
              heading="Vaccinated2"
              subHeading={cardData.vaccinated2.delta}
              number={cardData.vaccinated2.total}
              bgColor={"rgba(4, 171, 193, 0.1)"}
              hoverColor={"rgba(4, 171, 193, 0.15)"}
              fontColor={colors.teal}
              fontColorTransparent={colors.tealTransparent}
            />
          </Grid>
        </Zoom>
      </Grid>
    </div>
  );
}

export default Cards;
