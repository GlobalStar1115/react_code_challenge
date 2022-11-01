import React from 'react'
import Select from 'react-select'

//--layouts & components
import EditTableFilterLayout from '../../../layout/EditTableFilterLayout'

//--assets

//--actions


const TableFilterComponent = () => {

  const options = [
    {value: '1', label: '1'},
    {value: '2', label: '2'},
    {value: '3', label: '3'},
  ]

  return (
		<EditTableFilterLayout>
			<div className="table-edit-table-filter">
				<div className="filter-row">
                    <span>Saved Filters</span>
                    <Select classNamePrefix={"my-filter"} options={options} />
				</div>
                <div className="filter-row">
                    <span>Name</span>
                    <Select classNamePrefix={"my-filter"} options={options} />
				</div>
                <div className="filter-row">
                    <span>Targeting</span>
                    <Select classNamePrefix={"my-filter"} options={options} />
				</div>
                <div className="filter-row">
                    <span>Type</span>
                    <Select classNamePrefix={"my-filter"} options={options} />
				</div>
                <div className="filter-row">
                    <span>ACoS Target Zone</span>
                    <div className="filter-row-child">
                        <input type="text" placeholder="Min" />
                        <input type="text" placeholder="Max" />
                    </div>
                </div>
                <div className="filter-row">
                    <span>Daily Budget</span>
                    <div className="filter-row-child">
                        <input type="text" placeholder="Min" />
                        <input type="text" placeholder="Max" />
                    </div>
				</div>
                <div className="filter-row">
                    <span>Date Started</span>
                    <div className="filter-row-child">
                        <input type="text" placeholder="Min" />
                        <input type="text" placeholder="Max" />
                    </div>
				</div>
                <div className="filter-row">
                    <span>Revenue</span>
                    <div className="filter-row-child">
                        <input type="text" placeholder="Min" />
                        <input type="text" placeholder="Max" />
                    </div>
				</div>
                <div className="filter-row">
                    <span>Spend</span>
                    <div className="filter-row-child">
                        <input type="text" placeholder="Min" />
                        <input type="text" placeholder="Max" />
                    </div>
				</div>
                <div className="filter-row">
                    <span>Impressions</span>
                    <div className="filter-row-child">
                        <input type="text" placeholder="Min" />
                        <input type="text" placeholder="Max" />
                    </div>
				</div>
                <div className="filter-row">
                    <span>Clicks</span>
                    <div className="filter-row-child">
                        <input type="text" placeholder="Min" />
                        <input type="text" placeholder="Max" />
                    </div>
				</div>
			</div>
		</EditTableFilterLayout>
  );
}

export default TableFilterComponent
