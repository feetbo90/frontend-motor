import { computed } from 'vue'

export interface DateOption {
  value: number
  label: string
}

/**
 * Composable for date-related utilities
 * Provides month names in Indonesian and year options
 */
export function useDate() {
  // Month options in Indonesian
  const monthOptions: DateOption[] = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' }
  ]

  // Get current year and month
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1 // getMonth() returns 0-11, so add 1

  /**
   * Generate year options around current year
   * @param range - Number of years before and after current year (default: 5)
   * @returns Array of year options
   */
  const getYearOptions = (range: number = 5): DateOption[] => {
    return Array.from({ length: range * 2 + 1 }, (_, i) => {
      const year = currentYear - range + i
      return { value: year, label: year.toString() }
    })
  }

  /**
   * Get month name by number
   * @param monthNumber - Month number (1-12)
   * @returns Month name in Indonesian
   */
  const getMonthName = (monthNumber: number): string => {
    const month = monthOptions.find(m => m.value === monthNumber)
    return month ? month.label : ''
  }

  /**
   * Get current date as default values
   * @returns Object with current year and month
   */
  const getCurrentDate = () => ({
    tahun: currentYear,
    bulan: currentMonth
  })

  /**
   * Format date period string
   * @param year - Year number
   * @param month - Month number
   * @returns Formatted string like "Januari 2024"
   */
  const formatPeriod = (year: number, month: number): string => {
    const monthName = getMonthName(month)
    return `${monthName} ${year}`
  }

  /**
   * Validate if year and month are valid
   * @param year - Year number
   * @param month - Month number
   * @returns Boolean indicating if date is valid
   */
  const isValidDate = (year: number, month: number): boolean => {
    return year >= 1900 && year <= 2100 && month >= 1 && month <= 12
  }

  return {
    // Data
    monthOptions,
    currentYear,
    currentMonth,
    
    // Methods
    getYearOptions,
    getMonthName,
    getCurrentDate,
    formatPeriod,
    isValidDate
  }
}
