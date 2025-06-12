import DatePicker from '../../form/date-picker';
import { formatDateISO } from '@/lib/helpers/parser';

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
};

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: Props) {
  return (
    <div className="flex gap-4">
      <DatePicker
        label="Start date"
        id="startDate"
        value={formatDateISO(startDate)}
        onChange={(_dates, dateString) => {
          const date = dateString ? new Date(dateString) : null;
          onStartDateChange(date);
        }}
      />
      <DatePicker
        label="End date"
        id="endDate"
        value={formatDateISO(endDate)}
        onChange={(_dates, dateString) => {
          const date = dateString ? new Date(dateString) : null;
          onEndDateChange(date);
        }}
      />
    </div>
  );
}