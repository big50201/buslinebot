const _isEmpty = require("lodash/isEmpty");
const axios = require("../utils/axios");
const timeConvert = require("../utils/timeconvert");

const getContent = {
  getHeader: (number) => {
    return {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "公車名稱",
              color: "#ffffff66",
              size: "sm",
            },
            {
              type: "text",
              text: `${decodeURI(number)}`,
              color: "#ffffff",
              size: "xl",
              flex: 4,
              weight: "bold",
            },
          ],
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "方向",
              color: "#ffffff66",
              size: "sm",
            },
            {
              type: "text",
              text: `${"去程"}`,
              color: "#ffffff",
              size: "xl",
              flex: 4,
              weight: "bold",
            },
          ],
        },
      ],
      paddingAll: "20px",
      backgroundColor: "#0367D3",
      spacing: "md",
      height: "154px",
      paddingTop: "22px",
    };
  },
  getBody: async (number) => {
    const stopOfRouteUrl = `/Bus/DisplayStopOfRoute/City/Taipei/${number}?$select=Stops&$filter=Direction%20eq%200&$top=30&$format=JSON`;
    const realTimeNearStopUrl = `/Bus/RealTimeNearStop/City/Taipei/${number}?$filter=Direction%20eq%200&$top=30&$format=JSON`;
    const estimatedTimeOfArrivalUrl = `/Bus/EstimatedTimeOfArrival/City/Taipei/${number}?$select=StopID%2C%20EstimateTime&$filter=Direction%20eq%200&$top=30&$format=JSON`;

    const stopOfRouteApi = axios.get(stopOfRouteUrl);
    const realTimeNearStopApi = axios.get(realTimeNearStopUrl);
    const estimatedTimeOfArrivalApi = axios.get(estimatedTimeOfArrivalUrl);

    const response = await Promise.all([
      stopOfRouteApi,
      realTimeNearStopApi,
      estimatedTimeOfArrivalApi,
    ]);

    const stopOfRouteData = response[0].data[0];
    const realTimeNearStopData = response[1].data;
    const estimatedTimeOfArrivalData = response[2].data;

    if (!_isEmpty(stopOfRouteData)) {
      const body = stopOfRouteData.Stops.map((item) => {
        const estimatedTime = estimatedTimeOfArrivalData.find(
          (data) => data.StopID === item.StopID
        )
          ? estimatedTimeOfArrivalData.find(
              (data) => data.StopID === item.StopID
            ).EstimateTime
          : undefined;
        const a2eventType = realTimeNearStopData.find(
          (data) => data.StopID === item.StopID
        )
          ? realTimeNearStopData.find((data) => data.StopID === item.StopID)
              .A2EventType
            ? `進站中`
            : `離站`
          : `${
              estimatedTime
                ? Math.abs(timeConvert().secTomin(estimatedTime).min) === 0
                  ? `${timeConvert().secTomin(estimatedTime).sec}秒`
                  : `${timeConvert().secTomin(estimatedTime).sec}分`
                : ` `
            }`;

        return {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: `${a2eventType}`,
                      gravity: "center",
                      size: "sm",
                    },
                  ],
                  flex: 1,
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "filler",
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [],
                      cornerRadius: "30px",
                      width: "12px",
                      height: "12px",
                      borderWidth: "2px",
                      borderColor: `${
                        a2eventType === `進站中` ? `#EF454D` : `#6486E3`
                      }`,
                    },
                    {
                      type: "filler",
                    },
                  ],
                  flex: 0,
                },
                {
                  type: "text",
                  text: `${item.StopName.Zh_tw}`,
                  gravity: "center",
                  flex: 4,
                  size: "sm",
                  color: "#000000",
                },
              ],
              spacing: "lg",
              cornerRadius: "30px",
            },
          ],
        };
      });
      return body;
    }

    return [];
  },
};

module.exports = getContent;
