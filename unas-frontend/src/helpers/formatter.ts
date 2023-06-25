import "dayjs/locale/id";
import dayjs from "dayjs";

dayjs.locale("id");

export function formatDate(date: Date): string {
	return dayjs(date).format("D MMMM YYYY");
}
