import React from "react";
import ReactTable from "react-table";

const firstQuarter = [1, 2, 3];
const secondQuarter = [4, 5, 6];
const thirdQuarter = [7, 8, 9];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.today = new Date("4/18/18");
    this.currentQuarter = this.getSalesQuarter(this.today);

    this.state = {
      allData: [],
      tableData: [],
      tableColumns: []
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
            transactionTotal: +dataLine.TXN_SHARES * +dataLine.TXN_PRICE.replace("$", "")
          };
        });
        console.log("Data:", parsedData);
        this.setState({ allData: parsedData });
      })
      .catch(err => {
        console.log("errors", err);
      });
  }

  getSalesQuarter(date) {
    return firstQuarter.includes(date.getMonth())
      ? 1
      : secondQuarter.includes(date.getMonth())
      ? 2
      : thirdQuarter.includes(date.getMonth())
      ? 3
      : 4;
  }

  getSalesSummaries() {
    const salesReps = [...new Set(this.state.allData.map(x => x.SALES_REP))];
    const salesData = salesReps.map(rep => {
      const repSales = this.getRepSales(rep);
      return {
        salesRep: rep,
        yearToDate: repSales.yearToDate,
        monthToDate: repSales.monthToDate,
        quarterToDate: repSales.quarterToDate
      };
    });
    return salesData;
  }

  getColumns() {
    return [
      {
        Header: "Sales Rep",
        accessor: "salesRep"
      },
      {
        Header: "Sales This Month",
        accessor: "monthToDate"
      },
      {
        Header: "Sales This Quarter",
        accessor: "quarterToDate"
      },
      {
        Header: "Sales This Year",
        accessor: "yearToDate"
      }
    ];
  }

  getRepSales(rep) {
    let yearToDate = 0;
    let monthToDate = 0;
    let quarterToDate = 0;
    this.state.allData.forEach(dataLine => {
      if (dataLine.SALES_REP === rep && dataLine.TXN_TYPE === "SELL") {
        yearToDate += this.checkWithinYear(dataLine);
        monthToDate += this.checkWithinMonth(dataLine);
        quarterToDate += this.checkWithinQuarter(dataLine);
      }
    });
    return {
      yearToDate,
      monthToDate,
      quarterToDate
    };
  }

  checkWithinYear(data) {
    return data.TXN_DATE.getFullYear() === this.today.getFullYear() ? data.transactionTotal : 0;
  }

  checkWithinMonth(data) {
    return data.TXN_DATE.getMonth() === this.today.getMonth() ? data.transactionTotal : 0;
  }

  checkWithinQuarter(data) {
    return this.getSalesQuarter(data.TXN_DATE) === this.currentQuarter ? data.transactionTotal : 0;
  }

  render() {
    return (
      <div className="container">
        <ReactTable
          data={this.getSalesSummaries()}
          columns={this.getColumns()}
          defaultPageSize={5}
        />
      </div>
    );
  }
}

export default App;
