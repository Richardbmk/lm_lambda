###########
# BUILDER #
###########
FROM public.ecr.aws/lambda/python:3.10 as builder

RUN pip3 install --upgrade pip

COPY requirements.txt .

RUN pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

###########
# BUILDER #
###########
FROM public.ecr.aws/lambda/python:3.10
RUN pip3 install --upgrade pip

COPY --from=builder ${LAMBDA_TASK_ROOT} ${LAMBDA_TASK_ROOT}

COPY . ${LAMBDA_TASK_ROOT}

CMD ["handler.handler"]