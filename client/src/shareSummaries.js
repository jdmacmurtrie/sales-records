import React from "react";
import ReactTable from "react-table";

export class ShareSummaries extends React.Component {
  getInvestors() {
    return [...new Set(this.props.allData.map(x => x.INVESTOR))];
  }

  getAssetsSummaries() {
    return this.props.salesReps.map(rep => {
      const shares = this.getInvestorShares(rep);
      const tableData = {};
      shares.map(share => {
        Object.assign(tableData, {
          [share.investor]: share.assets
        });
      });
      return {
        ...tableData,
        salesRep: rep
      };
    });
  }

  getInvestorShares(rep) {
    const { allData } = this.props;
    const investors = this.getInvestors();
    const repInvestorData = [];
    investors.forEach(investor => {
      const investorData = allData.filter(dataLine => dataLine.INVESTOR === investor);
      const assets = this.calculateAssets(investorData, rep);
      repInvestorData.push({
        investor,
        assets: assets !== 0 ? assets : ""
      });
    });
    return repInvestorData;
  }

  calculateAssets(data, rep) {
    let total = 0;
    data.forEach(dataLine => {
      if (dataLine.SALES_REP === rep) {
        if (dataLine.TXN_TYPE === "BUY") {
          total += dataLine.TXN_SHARES;
        } else {
          total -= dataLine.TXN_SHARES;
        }
      }
    });
    return total;
  }

  getColumns() {
    const columns = this.getInvestors().length
      ? this.getInvestors().map(investor => {
          return {
            Header: investor,
            accessor: investor
          };
        })
      : [];
    columns.length &&
      columns.unshift({
        Header: "Sales Rep",
        accessor: "salesRep"
      });
    return columns;
  }

  render() {
    return (
      <ReactTable
        data={this.getAssetsSummaries()}
        columns={this.getColumns()}
        defaultPageSize={5}
        showPagination={false}
      />
    );
  }
}