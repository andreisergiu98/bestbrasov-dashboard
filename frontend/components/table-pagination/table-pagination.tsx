import {
	Flex,
	FlexProps,
	Icon,
	IconButton,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	Text,
	Tooltip,
} from '@chakra-ui/react';
import {
	FiChevronLeft,
	FiChevronRight,
	FiChevronsLeft,
	FiChevronsRight,
} from 'react-icons/fi';
import { PaginationProps } from './use-pagination';

interface Props extends FlexProps, PaginationProps {}

export function TablePagination(props: Props) {
	const {
		pageIndex,
		pageCount,
		pageSize,
		previousPageDisabled,
		nextPageDisabled,
		goToPage,
		goToPreviousPage,
		goToNextPage,
		setPageSize,
		...flexProps
	} = props;

	return (
		<Flex justifyContent="space-between" alignItems="center" {...flexProps}>
			<Flex>
				<Tooltip label="First Page">
					<IconButton
						aria-label="first page"
						onClick={() => goToPage(0)}
						isDisabled={previousPageDisabled}
						icon={<Icon as={FiChevronsLeft} h={6} w={6} />}
						mr={4}
					/>
				</Tooltip>
				<Tooltip label="Previous Page">
					<IconButton
						aria-label="previous page"
						onClick={goToPreviousPage}
						isDisabled={previousPageDisabled}
						icon={<Icon as={FiChevronLeft} h={6} w={6} />}
					/>
				</Tooltip>
			</Flex>

			<Flex alignItems="center">
				<Text flexShrink={0} mr={8}>
					Page{' '}
					<Text fontWeight="bold" as="span">
						{pageIndex + 1}
					</Text>{' '}
					of{' '}
					<Text fontWeight="bold" as="span">
						{pageCount}
					</Text>
				</Text>
				<Text flexShrink={0}>Go to page:</Text>{' '}
				<NumberInput
					ml={2}
					mr={8}
					w={28}
					min={1}
					max={pageCount}
					value={pageIndex + 1}
					onChange={(str, value) => {
						const page = value ? value - 1 : 0;
						goToPage(page);
					}}
				>
					<NumberInputField />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
				<Select
					w={32}
					value={pageSize}
					onChange={(e) => {
						setPageSize(Number(e.target.value));
					}}
				>
					{[10, 15, 20, 30, 40, 50].map((pageSize) => (
						<option key={pageSize} value={pageSize}>
							Show {pageSize}
						</option>
					))}
				</Select>
			</Flex>

			<Flex>
				<Tooltip label="Next Page">
					<IconButton
						aria-label="next page"
						onClick={goToNextPage}
						isDisabled={nextPageDisabled}
						icon={<Icon as={FiChevronRight} h={6} w={6} />}
					/>
				</Tooltip>
				<Tooltip label="Last Page">
					<IconButton
						aria-label="last page"
						onClick={() => goToPage(pageCount - 1)}
						isDisabled={nextPageDisabled}
						icon={<Icon as={FiChevronsRight} h={6} w={6} />}
						ml={4}
					/>
				</Tooltip>
			</Flex>
		</Flex>
	);
}
