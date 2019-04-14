import React from "react";
import { SalesSummaries } from "./salesSummaries";
import { ShareSummaries } from "./shareSummaries";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allData: [],
      salesReps: []
    };
  }

  componentDidMount() {
    fetch("http://localhost:8000/api/data")
      .then(response => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then(data => {
        const parsedData = data.map(dataLine => {
          return {
            ...dataLine,
            TXN_DATE: new Date(dataLine["TXN_DATE"]),
            TXN_PRICE: dataLine.TXN_PRICE.replace("$", ""),
            TXN_SHARES: +dataLine.TXN_SHARES,
            transactionTotal: +dataLine.TXN_SHARES * +dataLine.TXN_PRICE.replace("$", "")
          };
        });
        console.log("Data:", parsedData);
        const salesReps = [...new Set(data.map(x => x.SALES_REP))];
        this.setState({ salesReps, allData: parsedData });
      })
      .catch(err => {
        console.log("errors", err);
      });
  }

  render() {
    return (
      <div className="container">
        <SalesSummaries {...this.state} />
        <ShareSummaries {...this.state} />
      </div>
    );
  }
}

export default App;
