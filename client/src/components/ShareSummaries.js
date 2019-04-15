import React from "react";
import ReactTable from "react-table";

export class ShareSummaries extends React.Component {
  getAssetsSummaries() {
    return this.props.salesReps.map(rep => {
      const shares = this.getInvestorShares(rep);
      const tableData = {};
      shares.map(share => {
        Object.assign(tableData, {
          [share.investor.substring(0, 16)]: share.assets
        });
      });
      return {
        ...tableData,
        salesRep: rep
      };
    });
  }

  getInvestorShares(rep) {
    const { allData, investors } = this.props;
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
    const columns = this.props.investors.length
      ? this.props.investors.map(investor => {
          return {
            Header: investor,
            accessor: investor.substring(0, 16)
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
