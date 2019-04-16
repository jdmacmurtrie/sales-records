import React from "react";
import ReactTable from "react-table";
import { currencyFormatter } from "../constants";
import { firstQuarter, secondQuarter, thirdQuarter } from "../constants";
export class SalesSummaries extends React.Component {
  constructor(props) {
    super(props);
    this.today = new Date("4/18/18"); // for the purposes of the exercise
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
    // find each sales rep specific sales and calculate them
    return this.props.salesReps.map(rep => {
      const repSales = this.getRepSales(rep);
      return {
        salesRep: rep,
        ...repSales
      };
    });
  }

  getRepSales(rep) {
    let yearToDate = 0;
    let monthToDate = 0;
    let quarterToDate = 0;
    let inceptionToDate = 0;
    const repSalesData = this.props.allData.filter(
      dataLine => dataLine.SALES_REP === rep && dataLine.TXN_TYPE === "SELL"
    );

    repSalesData.forEach(dataLine => {
      yearToDate += this.checkWithinYear(dataLine);
      monthToDate += this.checkWithinMonth(dataLine);
      quarterToDate += this.checkWithinQuarter(dataLine);
      inceptionToDate += dataLine.transactionTotal; // salesman from inception is total amount sold from first sale
    });

    return {
      yearToDate: currencyFormatter.format(yearToDate),
      monthToDate: currencyFormatter.format(monthToDate),
      quarterToDate: currencyFormatter.format(quarterToDate),
      inceptionToDate: currencyFormatter.format(inceptionToDate)
    };
  }

  // check if the transaction date year/month/quarter is the same as today's year/month/quarter.
  checkWithinYear(data) {
        return data.TXN_DATE.getFullYear() === this.today.getFullYear() ? data.transactionTotal : 0;
  }

  checkWithinMonth(data) {
    return data.TXN_DATE.getMonth() === this.today.getMonth() ? data.transactionTotal : 0;
  }

  checkWithinQuarter(data) {
    return this.getSalesQuarter(data.TXN_DATE) === this.currentQuarter ? data.transactionTotal : 0;
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
      },
      {
        Header: "Sales Since Inception",
        accessor: "inceptionToDate"
      }
    ];
  }

  render() {
    return (
      <ReactTable
        data={this.getSalesSummaries()}
        columns={this.getColumns()}
        defaultPageSize={5}
        showPagination={false}
      />
    );
  }
}
