import React from "react";
import ReactTable from "react-table";

const firstQuarter = [1, 2, 3];
const secondQuarter = [4, 5, 6];
const thirdQuarter = [7, 8, 9];

export class SalesSummaries extends React.Component {
  constructor(props) {
    super(props);
    this.today = new Date("4/18/18");
    this.currentQuarter = this.getSalesQuarter(this.today);
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
    return this.props.salesReps.map(rep => {
      const repSales = this.getRepSales(rep);
      return {
        salesRep: rep,
        yearToDate: repSales.yearToDate,
        monthToDate: repSales.monthToDate,
        quarterToDate: repSales.quarterToDate
      };
    });
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

    this.props.allData.forEach(dataLine => {
      if (dataLine.SALES_REP === rep && dataLine.TXN_TYPE === "SELL") {
        yearToDate += this.checkWithinYear(dataLine);
        monthToDate += this.checkWithinMonth(dataLine);
        quarterToDate += this.checkWithinQuarter(dataLine);
      }
    });

    const currencyFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    });

    return {
      yearToDate: currencyFormatter.format(yearToDate),
      monthToDate: currencyFormatter.format(monthToDate),
      quarterToDate: currencyFormatter.format(quarterToDate)
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
    console.log("sales summaries", this.getSalesSummaries());

    return (
      <div className="container">
        <ReactTable
          data={this.getSalesSummaries()}
          columns={this.getColumns()}
          defaultPageSize={5}
          showPagination={false}
        />
      </div>
    );
  }
}
