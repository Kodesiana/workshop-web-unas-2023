import { Suspense, useContext, useEffect, useState } from "react";
import {
	ActionIcon,
	Button,
	Flex,
	Group,
	Loader,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
	DataTable,
	DataTableColumn,
	DataTableSortStatus,
} from "mantine-datatable";
import {
	IconEye,
	IconPencil,
	IconPlus,
	IconSearch,
	IconTrash,
} from "@tabler/icons-react";
import {
	Await,
	defer,
	useLoaderData,
	useLocation,
	useNavigate,
	useSearchParams,
} from "react-router-dom";

import { PostItem, PostList } from "@/services/posts.types";
import { deletePost, list } from "@/services/posts";
import { formatDate } from "@/helpers/formatter";
import { AuthContext } from "@/contexts/AuthContext";

export const PAGE_SIZES = [10, 25, 50];

export type ListProps = {
	data: PostList;
	page: number;
	limit: number;
	orderBy: string;
	order: "asc" | "desc";
};

export async function ListLoader({ request }: { request: Request }) {
	const url = new URL(request.url);
	const query = url.searchParams.get("q") || undefined;
	const page = parseInt(url.searchParams.get("page") || "1");
	const limit = parseInt(url.searchParams.get("limit") || "10");
	const orderBy = url.searchParams.get("orderBy") || "createdAt";
	const order = url.searchParams.get("order") || "desc";

	const data = list({
		q: query,
		page,
		limit,
		orderBy: orderBy as any,
		order: order as any,
	});

	return defer({ data, page, limit, orderBy, order });
}

export function List() {
	// route
	const [_, setQs] = useSearchParams();
	const location = useLocation();
	const navigate = useNavigate();
	const data = useLoaderData() as ListProps;
	// state
	const auth = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(true);
	const [search, setSearch] = useState("");

	// after navigation, set loading to false
	useEffect(() => {
		setIsLoading(false);
	}, [location]);

	function setQuery() {
		setIsLoading(true);
		setQs((prev) => {
			prev.set("q", search);
			return prev;
		});
	}

	function setPage(page: number) {
		setIsLoading(true);
		setQs((prev) => {
			prev.set("page", `${page}`);
			return prev;
		});
	}

	function setPageSize(limit: number) {
		setIsLoading(true);
		setQs((prev) => {
			prev.set("limit", `${limit}`);
			return prev;
		});
	}

	function setSortStatus(sortStatus: DataTableSortStatus) {
		setIsLoading(true);
		setQs((prev) => {
			prev.set("orderBy", `${sortStatus.columnAccessor}`);
			prev.set("order", `${sortStatus.direction}`);
			return prev;
		});
	}

	async function handleDelete(id: string) {
		modals.openConfirmModal({
			title: "Hapus Prediksi Penyakit",
			children: (
				<Text size="sm">Apakah Anda yakin ingin menghapus data ini?</Text>
			),
			centered: true,
			confirmProps: { color: "red" },
			labels: { confirm: "Hapus", cancel: "Batal" },
			onConfirm: () => {
				deletePost(id).then(() => {
					navigate("/admin");
				});
			},
		});
	}

	function handleLogout() {
		auth.logout();
		navigate("/admin/create");
	}

	const columns: DataTableColumn<PostItem>[] = [
		{ accessor: "title", title: "Judul", sortable: true },
		{ accessor: "author", title: "Penulis", sortable: true },
		{
			accessor: "createdAt",
			title: "Waktu Dipos",
			sortable: true,
			render: (row) => formatDate(row.createdAt),
		},
		{
			accessor: "actions",
			title: "Aksi",
			textAlignment: "right",
			render: (row) => (
				<Group spacing={4} position="right" noWrap>
					<ActionIcon onClick={() => navigate(`/${row.id}`)}>
						<IconEye size={16} />
					</ActionIcon>
					<ActionIcon
						color="green"
						onClick={() => navigate(`/admin/${row.id}`)}
					>
						<IconPencil size={16} />
					</ActionIcon>
					<ActionIcon color="red" onClick={() => handleDelete(row.id)}>
						<IconTrash size={16} />
					</ActionIcon>
				</Group>
			),
		},
	];

	const spinnerElement = (
		<Flex
			align={"center"}
			justify={"center"}
			wrap={"wrap"}
			direction={"column"}
		>
			<Loader />
			<Text>Memuat data...</Text>
		</Flex>
	);

	return (
		<div>
			<Group position="apart" mb="xl">
				<Stack spacing={0}>
					<Title order={2}>Daftar Artikel</Title>
					<Text>Daftar artikel pada blog.</Text>
				</Stack>
			</Group>
			<SimpleGrid>
				<Group spacing={0} position={"apart"}>
					<TextInput
						placeholder="Pencarian..."
						disabled={isLoading}
						rightSection={
							<ActionIcon variant="filled" onClick={setQuery}>
								<IconSearch size="1.1rem" stroke={1.5} />
							</ActionIcon>
						}
						onChange={(e) => setSearch(e.currentTarget.value)}
						onKeyUp={(event) => {
							if (event.key === "Enter") {
								setQuery();
							}
						}}
					/>
					<Flex gap={"md"}>
						<Button
							leftIcon={<IconPlus />}
							onClick={() => navigate("/admin/create")}
						>
							Artikel Baru
						</Button>
						<Button color="red" onClick={handleLogout}>
							Logout
						</Button>
					</Flex>
				</Group>
				<Suspense fallback={spinnerElement}>
					<Await resolve={data.data}>
						{(tableData) => (
							<DataTable
								withBorder
								// withColumnBorders
								highlightOnHover
								columns={columns}
								records={tableData.data}
								totalRecords={tableData.meta.total}
								page={data.page}
								recordsPerPage={data.limit}
								recordsPerPageOptions={PAGE_SIZES}
								sortStatus={{
									columnAccessor: data.orderBy,
									direction: data.order,
								}}
								onPageChange={setPage}
								onSortStatusChange={setSortStatus}
								onRecordsPerPageChange={setPageSize}
								fetching={isLoading}
								minHeight={500}
							/>
						)}
					</Await>
				</Suspense>
			</SimpleGrid>
		</div>
	);
}
