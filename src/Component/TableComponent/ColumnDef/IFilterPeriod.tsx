export interface FilterPeriodProps {
    openFilter: boolean;
    handleToggleFilter: () => void;
    selectedMonth: string;
    setSelectedMonth: (value: string) => void;
    selectedYear: string;
    setSelectedYear: (value: string) => void;
    selectedCompany: string;
    setSelectedCompany: (value: string) => void;
    handleFilter: () => void;
  }