'use client'
import React, { useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import {
  Button,
  Dropdown,
  Table,
  Input,
  Col,
  ConfirmDelete,
  PageTitle,
  Row,
  Collapse,
  Form,
  Spin,
  MenuProps,
  Modal
} from '@/components';
import {
  ArrowLeftOutlined,
  ClearOutlined,
  ImportOutlined,
  PlusOutlined,
  RollbackOutlined,
  SaveOutlined,
  SearchOutlined,
  UndoOutlined
} from '@icons';
import { 
  getRiskSelectOptions, 
  createNewRisk, 
  getRiskById, 
  updateRiskById, 
  markRiskCancelledById,
  cancelDraftById,
  getCategoriesLevel1,
  getCategoriesLevel2,
  getCategoriesLevel3
} from "@/services";
import Helper from "@/helper";
import { useRouter, useSearchParams } from "@/router";
import { DatePickerItem, InputItem, NumberItem, SelectItem, TextAreaItem } from "@form";
import { useRiskSelectOptions } from "@/hooks";
import { ListTitle } from "@/components/common/ListTitle";
import { AdditionalRiskTreatment, InherentRisk, Risk, RiskCause } from "@/models";
import { RiskStatusRaduis } from "@/components/risk-status";
import { RiskAggregationType } from "@/types";
import RiskMatrixHelper from "@/helper/risk.matrix";

export default function EditAddForm({ title, id }: { title: string, id?: string, action?: RiskAggregationType }) {
  const instance = Helper.getInstance()
  const { options, setOptions } = useRiskSelectOptions()
  const [categoriesLevel2, setCategoriesLevel2]  = useState<any[]>([])
  const [categoriesLevel3, setCategoriesLevel3] = useState<any[]>([])
  const [residualRiskScore, setResidualRiskScore] = useState<any>(null)
  const [inherentRiskScore, setInherentRiskScore] = useState<any>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [openCancelDraft, setOpenCancelDraft] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [searchedId, setSearchId] = useState<string>('')
  const [activeCollapse, setActiveCollapse] = useState<string[]>(["Risk_Details"])
  const [data, setData] = React.useState<Risk>(new Risk())

  const router = useRouter()
  const searchParams = useSearchParams()
  const backUrl = searchParams.get('back')

  const [form] = Form.useForm()
  let timer: any = null;

  React.useEffect(() => {
    getRiskSelectOptions()
    .then((response: any) => {
        if (response?.data) {
          const data = response.data;
          setOptions(data);

          // Set default period when create new risk
          if (!id) {
            form.setFieldsValue(data.period);
          }
        }
    })
    .finally(() => {})

    if (id) {
      fetchRiskById();
    } else {
      setData((prevState: Risk) => ({
        ...prevState,
        fiscalYear: options?.period?.fiscalYear,
        quarter: options?.period?.quarter
      }))

      setLoading(false)
    }
  }, []);

  const fetchRiskById = (searchRiskId?: string, searchDraft?: boolean) => {
    getRiskById(searchRiskId ?? id, searchDraft)
    .then((response: any) => {
      if (response) {
        if (searchDraft) {
          setSearchId(response.riskId);
        }
        
        setData(response);
        form.setFieldsValue({ ...response });

        // Initial Data Risk Cause Datatable
        if (response?.riskCauses) {
          response.riskCauses.forEach((riskCause: any, index: number) => {
            form.setFieldsValue({
              [`riskCauseCategory[${index}]`]: riskCause.category,
              [`riskCause[${index}]`]: riskCause.cause,
            });
          });
        }

        // Initial Data Impact Inherent Risks
        if (response?.impactInherentRisks) {
          response?.impactInherentRisks.forEach((impactInherentRisk: any, index: number) => {
            form.setFieldsValue({
              [`impactCategory[${index}]`]: impactInherentRisk.inherentImpactCategory,
              [`impactRating[${index}]`]: impactInherentRisk.inherentImpactRating,
              [`impactJustification[${index}]`]: impactInherentRisk.inherentImpactJustification,
              [`impactExistingRiskTreatmentCategory[${index}]`]: impactInherentRisk.inherentExistingCtrlCategory,
              [`impactExistingRiskTreatment[${index}]`]: impactInherentRisk.inherentExistingCtrlInfo,
              [`impactRiskTreatmentFocalPoint[${index}]`]: impactInherentRisk.inherentPersonInCharge,
            });
          });
        }

        // Initial Data Likelihood Inherent Risks
        if (response?.likelihoodInherentRisks) {
          response?.likelihoodInherentRisks.forEach((likelihoodInherentRisk: any, index: number) => {
            form.setFieldsValue({
              [`inherentLikelihoodCategory[${index}]`]: likelihoodInherentRisk.inherentLikelihoodCategory,
              [`inherentLikelihoodRating[${index}]`]: likelihoodInherentRisk.inherentLikelihoodRating,
              [`inherentLikelihoodJustification[${index}]`]: likelihoodInherentRisk.inherentLikelihoodJustification,
              [`inherentLikelihoodExisitingCtrlCat[${index}]`]: likelihoodInherentRisk.inherentLikelihoodExisitingCtrlCat,
              [`inherentLikelihoodExisitingCtrlInfo[${index}]`]: likelihoodInherentRisk.inherentLikelihoodExisitingCtrlInfo,
              [`inherentLikelihoodPIC[${index}]`]: likelihoodInherentRisk.inherentLikelihoodPIC,
            });
          });
        }

        const dateFormat = 'DD-MM-YYYY';
        // Initial Data Risk Treatment Impacts Datatable
        if (response?.impactRiskTreatments) {
          response.impactRiskTreatments.forEach((impactRiskTreatment: any, index: number) => {
            form.setFieldsValue({
              [`impactAddCtrlCategory[${index}]`]: impactRiskTreatment.impactAddCtrlCategory,
              [`impactAddCtrlDescription[${index}]`]: impactRiskTreatment.impactAddCtrlDescription,
              [`impactRemarks[${index}]`]: impactRiskTreatment.impactRemarks,
              [`impactPIC[${index}]`]: impactRiskTreatment.impactPIC,
              [`impactDueDate[${index}]`]: dayjs(impactRiskTreatment.impactDueDate, dateFormat),
              [`impactCost[${index}]`]: impactRiskTreatment.impactCost,
              [`impactStatus[${index}]`]: impactRiskTreatment.impactStatus,
            });
          });
        }

        // Initial Data Likelihood Risk Treatments Datatable
        if (response?.likelihoodRiskTreatments) {
          response.likelihoodRiskTreatments.forEach((likelihoodRiskTreatment: any, index: number) => {
            form.setFieldsValue({
              [`likelihoodAddCtrlCategory[${index}]`]: likelihoodRiskTreatment.likelihoodAddCtrlCategory,
              [`likelihoodAddCtrlDescription[${index}]`]: likelihoodRiskTreatment.likelihoodAddCtrlDescription,
              [`likelihoodRemarks[${index}]`]: likelihoodRiskTreatment.likelihoodRemarks,
              [`likelihoodPIC[${index}]`]: likelihoodRiskTreatment.likelihoodPIC,
              [`likelihoodDueDate[${index}]`]: dayjs(likelihoodRiskTreatment.likelihoodDueDate, dateFormat),
              [`likelihoodCost[${index}]`]: likelihoodRiskTreatment.likelihoodCost,
              [`LikelihoodStatus[${index}]`]: likelihoodRiskTreatment.likelihoodStatus,
            });
          });
        }
      } else {
        setSearchId('');
        setData(new Risk())
        form.resetFields();
        form.setFieldsValue({
          fiscalYear: options?.period?.fiscalYear,
          quarter: options?.period?.quarter
        });

        if (searchDraft) {
          Swal.fire({
            icon: "warning",
            title: "Risk Not Found",
            text: "No risk match your search",
            showConfirmButton: false,
            timer: 1500
          })
        }
      }
    })
    .catch((error: any) => {
        console.log(error);
    })
    .finally(() => {
        setLoading(false);
    })
  }

  const onMarkRiskAsCancelled = () => {
    setSubmitting(true);
    markRiskCancelledById(id)
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Your work has been updated",
        showConfirmButton: false,
        timer: 1500
      })
      .then(() => {
        fetchRiskById();
        setOpen(false);
      });
    })
    .finally(() => {
      setSubmitting(false);
    });
  };

  const onMakeCancelDraftById = () => {
    setSubmitting(true);
    cancelDraftById(id)
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "You've cancelled the risk",
        showConfirmButton: false,
        timer: 1500
      })
      .then(() => {
        fetchRiskById();
        setOpenCancelDraft(false);
      });
    })
    .finally(() => {
      setSubmitting(false);
    });
  };

  const onChangeCollapse = (key: any) => {
    if (Array.isArray(key) && key.length > 0) {
      const keyPanel = key[key.length - 1];
      setActiveCollapse([activeCollapse.includes(keyPanel) ? '' : keyPanel]);
    } else {
      setActiveCollapse([]);
    }
  };

  const onSearch = (event: any) => {
      const search = event.target.value;
      const { option, queryParams } = instance.appendFilterParams(searchParams, 'search', search);

      clearTimeout(timer);
      timer = setTimeout(() => {
          router.push(`?${queryParams}`);
          const searchDraft = true;
          fetchRiskById(option.search, searchDraft);
      }, 1200);
  };

  const onReset = () => {
    form.resetFields();
    form.setFieldsValue({
      fiscalYear: id ? data.fiscalYear : options?.period?.fiscalYear,
      quarter: id ? data.quarter : options?.period?.quarter
    });
  };

  const onFinish = (values: any) => {
    const riskCauses = instance.mapRiskCauses(data.riskCauses, values);
    const impactInherentRisks = instance.mapImpactInherentRisks(data.impactInherentRisks, values);
    const riskAddTreatments = instance.mapRiskTreatmentImpacts(data.impactRiskTreatments, values);
    const riskTreatmentLikelihoods = instance.mapRiskTreatmentLikelihoods(data.likelihoodRiskTreatments, values);
    
    values.riskStatus = values.riskStatus ?? 'Active';
    values.riskCauses = riskCauses;

    values.impactInherentRisks = impactInherentRisks;
    
    values.maxInherentRating = values.impactInherentRisks.reduce((max: number, current: any) => (current.inherentImpactRating > max ? current.inherentImpactRating : max), -Infinity);

    values.riskAddTreatments = riskAddTreatments;

    values.riskTreatmentLikelihoods = riskTreatmentLikelihoods;

    if (['ra_directorates', 'ra_directorates_show'].includes(backUrl || '')) {
      values.aggFlag = 'Directorate Level';
    } else if (['ra_departments', 'ra_departments_show'].includes(backUrl || '')) {
      values.aggFlag = 'Department Level';
    } else if (['ra_asec_wides', 'ra_asec_wides_show'].includes(backUrl || '')) {
      values.aggFlag = 'ASEC Wide';
    }
    
    setSubmitting(true);
    if (searchedId || id) {
      updateRiskById(values, searchedId ? searchedId : id)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Your work has been updated",
          showConfirmButton: false,
          timer: 1500
        })
        .then(() => {
          fetchRiskById();
        });
      })
      .catch((error: any) => {
        console.log('Error:', error);
      })
      .finally(() => {
        setSubmitting(false);
      })
    } else { 
      createNewRisk(values)
      .then((response: any) => {
        Swal.fire({
          icon: "success",
          title: values.riskStatus == "Draft" ? "Draft has been saved." : "Your work has been saved",
          text: '',
          showCancelButton: true,
          // confirmButtonColor: '',
          // cancelButtonColor: '',
          cancelButtonText: 'Add New',
          confirmButtonText: 'View Risk'
        })
        .then(({isDismissed}) => {
          if (isDismissed) {
            if (backUrl) {
              router.replace(backUrl);
            } else {
              form.resetFields();
              form.setFieldsValue({
                fiscalYear: options?.period?.fiscalYear,
                quarter: options?.period?.quarter
              });
            }
          } else {
            router.replace(`/risks/edit/${response?.id}`);
          }
        });
      })
      .catch((error: any) => {
        console.log('Error:', error);
      })
      .finally(() => {
        setSubmitting(false);
      })
    }
  };

  const onSubmit = () => {
    setActiveCollapse([
      'Risk_Details',
      'Inherent_Risk_Assessment_Treatment',
      'Additional_Risk_Treatment',
      'Residual_Risk_Assessment'
    ]);

    setTimeout(() => {
      form.validateFields()
      .then((values: any) => {
        if (values?.errorFields?.length > 0) {
          setActiveCollapse([
            'Risk_Details',
            'Inherent_Risk_Assessment_Treatment',
            'Additional_Risk_Treatment',
            'Residual_Risk_Assessment'
          ]);
        } else {
          onFinish(values);
        }
      })
    }, 2000);
  }

  const onSaveDraft = async () => {
    if (Helper.getInstance().hasPermission('RISK.SAVE.DRAFT')) {
      const values = await form.getFieldsValue();
    values.riskStatus = 'Draft';
    onFinish(values);
    }
  }

  const onCancelDraft = async () => {
    if (Helper.getInstance().hasPermission('RISK.CANCEL.DRAFT')) {
      // const values = await form.validateFields();
      // values.riskStatus = 'RemoveDraft';
      // onFinish(values);
      setOpenCancelDraft(true);
    }
  }

  const onChangeCategoryLevel1 = (level1: string) => {
    getCategoriesLevel2(level1)
    .then((response: any) => {
      if (response?.data) {
        setCategoriesLevel2(response.data)
      }
    })
  }

  const onChangeCategoryLevel2 = (level2: string) => {
    getCategoriesLevel3(level2)
    .then((response: any) => {
      if (response?.data) {
        setCategoriesLevel3(response.data)
      }
    })
  }

  /**
   * Risk Cause
   */
  const onAddNewRiskCause = () => {
    setData((prevState: Risk) => {
      const riskCause = new RiskCause();
      if (prevState.riskCauses?.length) {
        prevState.riskCauses = [...prevState.riskCauses, riskCause];
      } else {
        prevState.riskCauses = [riskCause];
      }

      return {...prevState};
    });
  }

  const onRemoveRiskCause = (record: RiskCause) => {
    let riskCauses = data.riskCauses;
    if (riskCauses?.length) {
      if (record.status === 'NEW') {
        riskCauses = riskCauses.filter((riskCause: RiskCause) => riskCause.id !== record.id);
      } else {
        const riskCause = riskCauses.find((riskCause: RiskCause) => riskCause.id == record.id);
        if (riskCause) {
          riskCause.status = 'ARCHIVE';
        }
      }
    }
  
    setData((prevState: Risk) => ({ ...prevState, riskCauses }));
  }

  /**
   * Impact Inherent Risks
   */

  const onAddNewImpactInherentRisks = () => {
    setData((prevState: Risk) => {
      const inherentRisk = new InherentRisk();
      if (prevState.impactInherentRisks?.length) {
        prevState.impactInherentRisks = [...prevState.impactInherentRisks, inherentRisk];
      } else {
        prevState.impactInherentRisks = [inherentRisk];
      }

      return {...prevState};
    });
  }

  /**
   * 
   * @param record 
   */
  const onRemoveImpactInherentRisks = (record: InherentRisk) => {
    let impactInherentRisks = data.impactInherentRisks;
    
    if (impactInherentRisks) {
      if (record.status === 'NEW') {
        impactInherentRisks = impactInherentRisks.filter((riskCause: InherentRisk) => riskCause.id !== record.id);
      } else {
        const impactInherentRisk = impactInherentRisks.find((riskCause: InherentRisk) => riskCause.id == record.id);
        if (impactInherentRisk) {
          impactInherentRisk.status = 'ARCHIVE';
        }
      }
    }

    setData((prevState: Risk) => ({ ...prevState, impactInherentRisks }));
  }

  /**
   * Risk Treatment Impact
   */

  const onAddNewRiskTreatmentImpact = () => {
    setData((prevState: Risk) => {
      const additionalRiskTreatment = new AdditionalRiskTreatment();
      if (prevState.impactRiskTreatments?.length) {
        prevState.impactRiskTreatments = [...prevState.impactRiskTreatments, additionalRiskTreatment];
      } else {
        prevState.impactRiskTreatments = [additionalRiskTreatment];
      }

      return {...prevState};
    });
  }

  const onRemoveRiskTreatmentImpact = (record: AdditionalRiskTreatment) => {
    let impactRiskTreatments = data.impactRiskTreatments;

    if (impactRiskTreatments) {
      if (record.status === 'NEW') {
        impactRiskTreatments = impactRiskTreatments.filter((additionalRiskTreatment: AdditionalRiskTreatment) => additionalRiskTreatment.id !== record.id);
      } else {
        const impactRiskTreatment = impactRiskTreatments.find((additionalRiskTreatment: AdditionalRiskTreatment) => additionalRiskTreatment.id == record.id);
        if (impactRiskTreatment) {
          impactRiskTreatment.status = 'ARCHIVE';
        }
      }
    }

    setData((prevState: Risk) => ({ ...prevState, impactRiskTreatments }));
  }

  /**
   * Risk Treatment Likelihood
   */

  const onAddNewRiskTreatmentLikelihood = () => {
    setData((prevState: Risk) => {
      const additionalRiskTreatment = new AdditionalRiskTreatment();
      if (prevState.likelihoodRiskTreatments?.length) {
        prevState.likelihoodRiskTreatments = [...prevState.likelihoodRiskTreatments, additionalRiskTreatment];
      } else {
        prevState.likelihoodRiskTreatments = [additionalRiskTreatment];
      }

      return {...prevState};
    });
  }

  /**
   * 
   * @param record 
   */
  const onRemoveRiskTreatmentLikelihood = (record: AdditionalRiskTreatment) => {
    let likelihoodRiskTreatments = data.likelihoodRiskTreatments;

    if (likelihoodRiskTreatments) {
      if (record.status === 'NEW') {
        likelihoodRiskTreatments = likelihoodRiskTreatments.filter((riskCause: AdditionalRiskTreatment) => riskCause.id !== record.id);
      } else {
        const likelihoodRiskTreatment = likelihoodRiskTreatments.find((riskCause: AdditionalRiskTreatment) => riskCause.id == record.id);
        if (likelihoodRiskTreatment) {
          likelihoodRiskTreatment.status = 'ARCHIVE';
        }
      }
    }

    setData((prevState: Risk) => ({ ...prevState, likelihoodRiskTreatments }));
  }

  /**
   * 
   * @param value value here is refer to inherent likelihood rating when pass
   * direct with select item, but when with inherent impact rating pass only null value
   */
  const onChanageInherentImpactRating = async (value?: number) => {
    const inherentLikelihoodRating = value ?? await form.getFieldValue('inherentLikelihoodRating');console.log('inherentLikelihoodRating:', inherentLikelihoodRating);
    const formValues = await form.getFieldsValue();

    const impactInherentRisks = instance.mapImpactInherentRisks(data.impactInherentRisks, formValues);
    
    let maxInherentRating = 0;
    if (impactInherentRisks) {
      maxInherentRating = impactInherentRisks.reduce((max: number, current: any) => (current.inherentImpactRating > max ? current.inherentImpactRating : max), -Infinity);
    }
    const result = RiskMatrixHelper.getInstance().calculateInherentScore(inherentLikelihoodRating, maxInherentRating);
    form.setFieldsValue({
      inherentRiskScoreDescription: result.inherentRiskScoredesc,
      inherentRiskScore: result.inherentRiskScore
    });

    setInherentRiskScore(result);
  };

  const onChangeResidualImpactRating = async (residualImpactRating: any) => {
    const residualLikelihoodRating = await form.getFieldValue('residualLikelihoodRating');
    const residualRisk = RiskMatrixHelper.getInstance().calculateResidualScore(residualImpactRating, residualLikelihoodRating);
    form.setFieldsValue({
      residualRiskScoreDescription: residualRisk.residualRiskScoredesc,
      residualRiskScore: residualRisk.residualRiskScore,
    });
    setResidualRiskScore(residualRisk);
  }

  const onChangeResidualLikelihoodRating = async (residualLikelihoodRating: number) => {
    const residualImpactRating = await form.getFieldValue('residualImpactRating');
    const residualRisk = RiskMatrixHelper.getInstance().calculateResidualScore(residualImpactRating, residualLikelihoodRating);
    form.setFieldsValue({
      residualRiskScoreDescription: residualRisk.residualRiskScoredesc,
      residualRiskScore: residualRisk.residualRiskScore,
    });
    setResidualRiskScore(residualRisk);
  }
  
  const items: MenuProps['items'] = [
    {
      label: 'Save Draft',
      key: '1',
      disabled: !data.id && data.riskStatus === 'Active',
      icon: <SaveOutlined />,
      onClick: onSaveDraft
    },
    {
      label: 'Cancel Draft',
      key: '2',
      icon: <RollbackOutlined />,
      disabled: !data.id && data.riskStatus === 'Active',
      onClick: onCancelDraft
    },
    {
      type: 'divider',
    },
    {
      label: 'Mark as Cancelled',
      key: '3',
      icon: <UndoOutlined />,
      disabled: data.id === null,
      onClick: () => {
        if (Helper.getInstance().hasPermission('RISK.CANCEL.RISK')) {
          setOpen(true)
        }
      }
    },
    {
      label: 'New Risk',
      key: '4',
      icon: <PlusOutlined />,
      disabled: data.id === null,
      onClick: () => router.replace('/risks/create')
    }
  ];

  const menuProps = {
    items
  };

  const renderRightAction = () => {
    if (['ra_directorates', 'ra_directorates_show', 'ra_departments', 'ra_departments_show', 'ra_asec_wides', 'ra_asec_wides_show'].includes(backUrl || '')) {
      return <div>
          <Button loading={submitting} disabled={submitting} type="primary"  onClick={onSubmit} style={{ marginLeft: 15 }}>
            Submit
          </Button>
      </div>
    } else {
      return <>
        <Input placeholder="Search draft risk event..." autoFocus={true} style={{ width: 250, display: 'non' }} prefix={<SearchOutlined />} allowClear onChange={onSearch} />
        <Button
          icon={<ClearOutlined />}
          style={{ marginLeft: 15 }}
          onClick={onReset}
        >
          Clear
        </Button>
        <Button
          icon={<ImportOutlined />}
          style={{ marginLeft: 15 }}
          onClick={() => {
            if (Helper.getInstance().hasPermission('RISK.IMPORT')) {
              router.push('/risks/import')
            }
          }}
        >
          Import Risk
        </Button>
        <div>
          <Dropdown.Button loading={submitting} disabled={submitting || (!data.id && data.riskStatus === 'Cancelled')} type="primary" menu={menuProps} onClick={onSubmit} style={{ marginLeft: 15 }}>
            Submit
          </Dropdown.Button>
        </div>
      </>
    }
  }
  
  return (<Spin spinning={loading}>
    <Modal
         title="Are you sure?"
         open={open}
         onOk={onMarkRiskAsCancelled}
         onCancel={() => setOpen(false)}
         okText="Yes, cancel it!"
         okButtonProps={{ danger: true, loading: submitting, disabled: submitting }}
         cancelText="Cancel"
      >
         <p>You will be able to revert this!</p>
    </Modal>

    <Modal
         title="Are you sure?"
         open={openCancelDraft}
         onOk={onMakeCancelDraftById}
         onCancel={() => setOpenCancelDraft(false)}
         okText="Yes, cancel it!"
         okButtonProps={{ danger: true, loading: submitting, disabled: submitting }}
         cancelText="Cancel"
      >
         <p>You will not be able to revert this!</p>
    </Modal>

    <Row gutter={[16, 16]}>
      <Col sm={24} md={6} xl={8} style={{ display: 'flex', alignItems: 'center' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => {
          if (backUrl === 'ra_directorates_show') {
            router.back()
          } else if (backUrl) {
            router.replace(`/${backUrl}`)
          } else {
            router.back()
          }
        }}>
          Back
        </Button>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PageTitle title={title} style={{ marginLeft: 15 }} />
          <RiskStatusRaduis status={data.riskStatus} />
        </div>
      </Col>
      <Col sm={24} md={18} xl={16} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {renderRightAction()}
      </Col>
      <Col sm={24} md={24} xl={24}>
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Collapse activeKey={[...activeCollapse]} destroyInactivePanel onChange={(key: any) => onChangeCollapse(key)} items={[
              {
                key: 'Risk_Details',
                label: 'Risk Details',
                className: 'risk-header-collapse',
                children: <Row gutter={[20, 20]}>
                  <Col sm={24} md={6} xl={6} style={{ display: "flex", alignItems: 'flex-end' }}>
                    <InputItem label="Period" name="fiscalYear" placeholder="Enter period" disabled />
                    <InputItem name="quarter" placeholder="Enter cycle" disabled style={{ marginLeft: 15 }} />
                  </Col>
                  <Col sm={24} md={6} xl={6}>
                    <SelectItem
                      label="Department"
                      name="department"
                      placeholder="Select department"
                      options={options.departments}
                      required
                    />
                  </Col>
                  <Col sm={24} md={6} xl={6}>
                    <SelectItem
                      label="Directorate"
                      name="directorate"
                      placeholder="Select directorate"
                      options={options.directorates}
                      required
                    />
                  </Col>
                  <Col sm={24} md={6} xl={6}>
                    <SelectItem
                      label="Division"
                      name="division"
                      placeholder="Select division"
                      options={options.divisions}
                      required
                    />
                  </Col>
                  <Col sm={24} md={6} xl={6}>
                    <SelectItem
                      label="Risk Category Level 1"
                      name="riskCategoryL1"
                      placeholder="Select risk category level 1"
                      options={options.categoriesLevel1}
                      onChange={onChangeCategoryLevel1}
                      showSearch
                      required
                    />
                  </Col>
                  <Col sm={24} md={6} xl={6}>
                    <SelectItem
                      label="Risk Category Level 2"
                      name="riskCategoryL2"
                      placeholder="Select risk category level 2"
                      options={categoriesLevel2}
                      onChange={onChangeCategoryLevel2}
                      showSearch
                      required
                    />
                  </Col>
                  <Col sm={24} md={6} xl={6}>
                    <SelectItem
                      label="Risk Category Level 3"
                      name="riskCategoryL3"
                      placeholder="Select risk category level 3"
                      options={categoriesLevel3}
                      showSearch
                      required
                    />
                  </Col>
                  <Col sm={24} md={6} xl={12}>
                    <TextAreaItem
                      label="Objectives"
                      name="objectives"
                      placeholder="Please fill in the division’s objective that might not be achieved if the risk occurs."
                      autoSize={{ minRows: 4 }}
                      required
                    />
                  </Col>
                  <Col sm={24} md={6} xl={12}>
                    <TextAreaItem
                      label="Risk Event"
                      name="riskEvent"
                      placeholder="Please fill in the risk event that could hinder the achievement of the objective."
                      autoSize={{ minRows: 4 }}
                      required
                    />
                  </Col>
                  <Col sm={24} md={6} xl={24}>
                    <ListTitle title="Risk Causes" />
                    <Table
                      columns={[
                        {
                          title: 'Category',
                          key: 'category',
                          dataIndex: 'category',
                          width: '40%',
                          render: (causeCategory: string, record: any, index: number) => {
                            return <SelectItem
                              name={`riskCauseCategory[${index}]`}
                              placeholder="Select cause category"
                              rules={[{ required: true, message: "Please select risk cause category" }]}
                              options={options.riskCauseCategories}
                            />;
                          }
                        },
                        {
                          title: 'Cause',
                          key: 'cause',
                          dataIndex: 'cause',
                          render: (cause: string, record: any, index: number) => {
                            return <TextAreaItem
                              name={`riskCause[${index}]`}
                              placeholder="Enter cause of the risk"
                              rules={[{ required: true, message: "Please enter cause of the risk" }]}
                              autoSize={{ minRows: 3 }}
                            />
                          }
                        },
                        {
                          title: 'Action',
                          key: 'id',
                          dataIndex: 'id',
                          width: 100,
                          render: (id: number, record: RiskCause) => {
                            return <ConfirmDelete record={record} onConfirm={() => onRemoveRiskCause(record)} />;
                          }
                        }
                      ]}
                      rowKey={'id'}
                      rowClassName={(record: any) => record.status === 'ARCHIVE' ? 'ar-table-row-hidden' : ''}
                      dataSource={data.riskCauses}
                      pagination={false}
                      footer={() => 
                        <Button type="primary" icon={<PlusOutlined />} onClick={onAddNewRiskCause} />
                      }
                    />
                  </Col>
                </Row>,
              },
              {
                key: 'Inherent_Risk_Assessment_Treatment',
                label: 'Inherent Risk Assessment & Treatment',
                children: <Row gutter={[20, 20]}>
                  <Col sm={24} md={6} xl={24}>
                    <Table
                      columns={[
                        {
                          title: 'Impact Category',
                          key: 'impactCategory',
                          dataIndex: 'impactCategory',
                          render: (impactCategory: string, _: any, index: number) => {
                            return <SelectItem
                              name={`impactCategory[${index}]`}
                              placeholder="Please select"
                              options={options.impactCategories}
                              rules={[{ required: true, message: "Please select impact category" }]}
                              allowClear
                              showSearch
                            />;
                          }
                        },
                        {
                          title: 'Inherent Impact Rating',
                          key: 'inherentImpactRating',
                          dataIndex: 'inherentImpactRating',
                          render: (inherentImpactRating: string, _: any, index: number) => {
                            return <SelectItem
                              name={`impactRating[${index}]`}
                              placeholder="Please select"
                              options={options.inherentImpactRatings}
                              rules={[{ required: true, message: "Please select impact rating" }]}
                              onChange={() => onChanageInherentImpactRating()}
                              allowClear
                            />;
                          }
                        },
                        {
                          title: 'Inherent Impact Justification',
                          key: 'inherentImpactJustification',
                          dataIndex: 'inherentImpactJustification',
                          render: (inherentImpactJustification: string, _: any, index: number) => {
                            return <TextAreaItem
                              name={`impactJustification[${index}]`}
                              placeholder="Enter impact jusitifaction"
                              rules={[{ required: true, message: "Please select impact justification" }]}
                              autoSize={{ minRows: 3 }}
                            />
                          }
                        },
                        {
                          title: 'Existing Risk Treatment Category',
                          key: 'existingRiskTreatmentCategory',
                          dataIndex: 'existingRiskTreatmentCategory',
                          render: (existingRiskTreatmentCategory: string, _: any, index: number) => {
                            return <SelectItem
                              name={`impactExistingRiskTreatmentCategory[${index}]`}
                              placeholder="Please select"
                              rules={[{ required: true, message: "Please select impact existing risk treatment category" }]}
                              options={options.existingRiskTreatmentCategories}
                              allowClear
                            />;
                          }
                        },
                        {
                          title: 'Existing Risk Treatment',
                          key: 'existingRiskTreatment',
                          dataIndex: 'existingRiskTreatment',
                          render: (existingRiskTreatment: string, _: any, index: number) => {
                            return <TextAreaItem
                              name={`impactExistingRiskTreatment[${index}]`}
                              placeholder="Enter existing risk treatment"
                              rules={[{ required: true, message: "Please enter existing risk treatment" }]}
                              autoSize={{ minRows: 3 }}
                            />
                          }
                        },
                        {
                          title: 'Risk Treatment Focal Point',
                          key: 'riskTreatmentFocalPoint',
                          dataIndex: 'riskTreatmentFocalPoint',
                          render: (riskTreatmentFocalPoint: string, _: any, index: number) => {
                            return <SelectItem
                              name={`impactRiskTreatmentFocalPoint[${index}]`}
                              placeholder="Please select"
                              rules={[{ required: true, message: "Please enter impact risk treatment focal point" }]}
                              options={options.riskTreatmentFocalPoints}
                              allowClear
                              showSearch
                            />;
                          }
                        },
                        {
                          title: 'Action',
                          key: 'id',
                          dataIndex: 'id',
                          width: 60,
                          render: (id: number, record: InherentRisk) => {
                            return <ConfirmDelete record={record} onConfirm={() => onRemoveImpactInherentRisks(record)} />;
                          }
                        }
                      ]}
                      dataSource={data.impactInherentRisks}
                      rowKey={'id'}
                      rowClassName={(record: any) => record.status === 'ARCHIVE' ? 'ar-table-row-hidden' : ''}
                      pagination={false}
                      footer={() => 
                        <Button type="primary" icon={<PlusOutlined />} onClick={onAddNewImpactInherentRisks} />
                      }
                    />
                  </Col>
                  <Col sm={24} md={6} xl={24}>
                    <Table
                      columns={[
                        {
                          title: 'Likelihood Category',
                          key: 'likelihoodCategory',
                          dataIndex: 'likelihoodCategory',
                          render: (likelihoodCategory: string, _: any, index: number) => {
                            return <SelectItem
                              name="inherentLikelihoodCategory"
                              placeholder="Please select"
                              rules={[{ required: true, message: "Please select inherent likelihood category" }]}
                              options={options.likelihoodCategories}
                              allowClear
                              showSearch
                            />;
                          }
                        },
                        {
                          title: 'Inherent Likelihood Rating',
                          key: 'inherentLikelihoodRating',
                          dataIndex: 'inherentLikelihoodRating',
                          render: (inherentLikelihoodRating: string, _: any, index: number) => {
                            return <SelectItem
                              name="inherentLikelihoodRating"
                              placeholder="Please select"
                              rules={[{ required: true, message: "Please select inherent likelihood rating" }]}
                              options={options.inherentLikelihoodRatings}
                              onChange={onChanageInherentImpactRating}
                              allowClear
                            />;
                          }
                        },
                        {
                          title: 'Inherent Likelihood Justification',
                          key: 'inherentLikelihoodJustification',
                          dataIndex: 'inherentLikelihoodJustification',
                          render: (inherentLikelihoodJustification: string, _: any, index: number) => {
                            return <TextAreaItem
                              name="inherentLikelihoodJustification"
                              placeholder="Enter likelihood jusitifaction"
                              rules={[{ required: true, message: "Please enter likelihood jusitifaction" }]}
                              autoSize={{ minRows: 3 }}
                            />
                          }
                        },
                        {
                          title: 'Existing Risk Treatment Category',
                          key: 'likelihoodExstCtrlCategory',
                          dataIndex: 'likelihoodExstCtrlCategory',
                          render: (existingRiskTreatmentCategory: string, _: any, index: number) => {
                            return <SelectItem
                              name="inherentLikelihoodExisitingCtrlCat"
                              placeholder="Please select"
                              rules={[{ required: true, message: "Please select" }]}
                              options={options.existingRiskTreatmentCategories}
                              allowClear
                              showSearch
                            />;
                          }
                        },
                        {
                          title: 'Existing Risk Treatment',
                          key: 'likelihoodCtrlInfo',
                          dataIndex: 'likelihoodCtrlInfo',
                          render: (existingRiskTreatment: string, _: any, index: number) => {
                            return <TextAreaItem
                              name="inherentLikelihoodExisitingCtrlInfo"
                              placeholder="Enter existing risk treatment"
                              rules={[{ required: true, message: "Please enter " }]}
                              autoSize={{ minRows: 3 }}
                            />
                          }
                        },
                        {
                          title: 'Risk Treatment Focal Point',
                          key: 'inherentLikelihoodPIC',
                          dataIndex: 'inherentLikelihoodPIC',
                          render: (riskTreatmentFocalPoint: string, _: any, index: number) => {
                            return <SelectItem
                              name="inherentLikelihoodPIC"
                              placeholder="Please select"
                              required
                              options={options.riskTreatmentFocalPoints}
                            />;
                          }
                        } 
                      ]}
                      dataSource={data.likelihoodInherentRisks}
                      pagination={false}
                    />
                  </Col>
                </Row>,
              },
              {
                key: 'Additional_Risk_Treatment',
                label: 'Additional Risk Treatment',
                children: <Row gutter={[20, 20]}>
                  <Col sm={24} md={24} lg={24}>
                    <h4>Risk Treatment Impact</h4>
                    <Table
                      columns={[
                        {
                          title: 'Category',
                          key: 'impactAddCtrlCategory',
                          dataIndex: 'impactAddCtrlCategory',
                          render: (riskTreatmentCategoryImpact: string, _: any, index: number) => {
                            return <SelectItem
                              name={`impactAddCtrlCategory[${index}]`}
                              placeholder="Please select"
                              rules={[{ required: true, message: "Please select " }]}
                              options={options.riskCauseCategories}
                            />;
                          }
                        },
                        {
                          title: 'Information for Impact',
                          key: 'impactAddCtrlDescription',
                          dataIndex: 'impactAddCtrlDescription',
                          render: (impactAddCtrlDescription: string, _: any, index: number) => {
                            return <TextAreaItem
                              name={`impactAddCtrlDescription[${index}]`}
                              placeholder="Please fill in the additional risk treatment activity to address the impact."
                              rules={[{ required: true, message: "Please enter " }]}
                              autoSize={{ minRows: 3 }}
                            />
                          }
                        },
                        {
                          title: 'Remarks',
                          key: 'impactRemarks',
                          dataIndex: 'impactRemarks',
                          render: (impactRemarks: string, _: any, index: number) => {
                            return <TextAreaItem
                              name={`impactRemarks[${index}]`}
                              placeholder="Please fill in any remarks/additional information regarding the risk treatment (if any)."
                              rules={[{ required: true, message: "Please enter " }]}
                              autoSize={{ minRows: 3 }}
                            />
                          }
                        },
                        {
                          title: 'Focal Point',
                          key: 'impactPIC',
                          dataIndex: 'impactPIC',
                          render: (focalPointImpact: string, _: any, index: number) => {
                            return <SelectItem
                              name={`impactPIC[${index}]`}
                              placeholder="Please select"
                              rules={[{ required: true, message: "Please select " }]}
                              options={options.riskCauseCategories}
                            />;
                          }
                        },
                        {
                          title: 'Due Date',
                          key: 'impactDueDate',
                          dataIndex: 'impactDueDate',
                          render: (impactDueDate: string, _: any, index: number) => {
                            return <DatePickerItem
                              name={`impactDueDate[${index}]`}
                              placeholder="Please select"
                              rules={[{ required: true, message: "Please select " }]}
                            />;
                          }
                        },
                        {
                          title: 'Cost (In USD)',
                          key: 'impactCost',
                          dataIndex: 'impactCost',
                          render: (impactCost: string, _: any, index: number) => {
                            return <NumberItem
                              name={`impactCost[${index}]`}
                              placeholder="Enter cost"
                              rules={[{ required: true, message: "Please enter " }]}
                            />;
                          }
                        },
                        {
                          title: 'Status',
                          key: 'impactStatus',
                          dataIndex: 'impactStatus',
                          render: (impactStatus: string, _: any, index: number) => {
                            return <SelectItem
                              name={`impactStatus[${index}]`}
                              placeholder="Please select"
                              rules={[{ required: true, message: "Please select " }]}
                              options={options.riskTreatmentStatuses}
                            />;
                          }
                        },
                        {
                          title: 'Action',
                          key: 'id',
                          dataIndex: 'id',
                          width: 60,
                          render: (id: number, record: InherentRisk) => {
                            return <ConfirmDelete record={record} onConfirm={() => onRemoveRiskTreatmentImpact(record)} />;
                          }
                        }
                      ]}
                      rowKey={'id'}
                      rowClassName={(record: any) => record.status === 'ARCHIVE' ? 'ar-table-row-hidden' : ''}
                      dataSource={data.impactRiskTreatments}
                      pagination={false}
                      footer={() => 
                        <Button type="primary" icon={<PlusOutlined />} onClick={onAddNewRiskTreatmentImpact} />
                      }
                    />
                  </Col>
                  <Col sm={24} md={24} lg={24}>
                    <h4>Risk Treatment Likelihood</h4>
                    <Table
                          columns={[
                            {
                              title: 'Category',
                              key: 'likelihoodAddCtrlCategory',
                              dataIndex: 'likelihoodAddCtrlCategory',
                              render: (likelihoodAddCtrlCategory: string, _: any, index: number) => {
                                return <SelectItem
                                  name={`likelihoodAddCtrlCategory[${index}]`}
                                  placeholder="Please select"
                                  required
                                  options={options.likelihoodCategories}
                                />;
                              }
                            },
                            {
                              title: 'Information for Likelihood',
                              key: 'likelihoodAddCtrlDescription',
                              dataIndex: 'likelihoodAddCtrlDescription',
                              render: (likelihoodAddCtrlDescription: string, _: any, index: number) => {
                                return <TextAreaItem
                                  name={`likelihoodAddCtrlDescription[${index}]`}
                                  placeholder="Please fill in the additional risk treatment activity to prevent the risk from occurring."
                                  required
                                  autoSize={{ minRows: 3 }}
                                />
                              }
                            },
                            {
                              title: 'Remarks',
                              key: 'likelihoodRemarks',
                              dataIndex: 'likelihoodRemarks',
                              render: (likelihoodRemarks: string, _: any, index: number) => {
                                return <TextAreaItem
                                  name={`likelihoodRemarks[${index}]`}
                                  placeholder="Please fill in any remarks/additional information regarding the risk treatment (if any)."
                                  required
                                  autoSize={{ minRows: 3 }}
                                />
                              }
                            },
                            {
                              title: 'Focal Point',
                              key: 'likelihoodPIC',
                              dataIndex: 'likelihoodPIC',
                              render: (likelihoodPIC: string, _: any, index: number) => {
                                return <SelectItem
                                  name={`likelihoodPIC[${index}]`}
                                  placeholder="Please select"
                                  required
                                  options={options.riskTreatmentFocalPoints}
                                />;
                              }
                            },
                            {
                              title: 'Due Date',
                              key: 'likelihoodDueDate',
                              dataIndex: 'likelihoodDueDate',
                              render: (likelihoodDueDate: string, _: any, index: number) => {
                                return <DatePickerItem
                                  name={`likelihoodDueDate[${index}]`}
                                  placeholder="Please select"
                                  required
                                />;
                              }
                            },
                            {
                              title: 'Cost (In USD)',
                              key: 'likelihoodCost',
                              dataIndex: 'likelihoodCost',
                              render: (costLikelihood: string, _: any, index: number) => {
                                return <NumberItem
                                  name={`likelihoodCost[${index}]`}
                                  placeholder="Enter cost"
                                  required
                                />;
                              }
                            },
                            {
                              title: 'Status',
                              key: 'LikelihoodStatus',
                              dataIndex: 'LikelihoodStatus',
                              render: (ImpactStatus: string, _: any, index: number) => {
                                return <SelectItem
                                  name={`LikelihoodStatus[${index}]`}
                                  placeholder="Please select"
                                  required
                                  options={options.riskTreatmentStatuses}
                                />
                              }
                            },
                            {
                              title: 'Action',
                              key: 'id',
                              dataIndex: 'id',
                              width: 60,
                              render: (_: number, record: InherentRisk) => {
                                return <ConfirmDelete record={record} onConfirm={() => onRemoveRiskTreatmentLikelihood(record)} />;
                              }
                            }
                          ]}
                          rowKey={'id'}
                          rowClassName={(record: any) => record.status === 'ARCHIVE' ? 'ar-table-row-hidden' : ''}
                          dataSource={data.likelihoodRiskTreatments}
                          pagination={false}
                          footer={() => 
                            <Button type="primary" icon={<PlusOutlined />} onClick={onAddNewRiskTreatmentLikelihood} />
                          }
                        />
                  </Col>
                </Row>,
              },
              {
                key: 'Residual_Risk_Assessment',
                label: 'Residual Risk Assessment',
                children: <Row gutter={[20, 20]}>
                  <Col sm={24} md={6} xl={12}>
                    <SelectItem
                      label="Residual Impact Rating"
                      name="residualImpactRating"
                      placeholder="Select impact rating"
                      options={options.residualImpactRatings}
                      onChange={onChangeResidualImpactRating}
                    />
                  </Col>
                  <Col sm={24} md={6} xl={12}>
                    <SelectItem
                      label="Residual Likelihood Rating"
                      name="residualLikelihoodRating"
                      placeholder="Select residual rating"
                      options={options.residualLikelihoodRatings}
                      onChange={onChangeResidualLikelihoodRating}
                    />
                  </Col>
                  <Col sm={24} md={6} xl={12}>
                    <InputItem
                      label="Inherent Risk Score Description"
                      name="inherentRiskScoreDescription"
                      placeholder="Enter inherent risk score description"
                      readOnly
                    />
                  </Col>
                  <Col sm={24} md={6} xl={12}>
                    <InputItem
                      label="Residual Risk Score Description"
                      name="residualRiskScoreDescription"
                      placeholder="Enter residual risk score description"
                      readOnly
                    />
                  </Col>
                  <Col sm={24} md={6} xl={12}>
                    <InputItem
                      label="Inherent Risk Score"
                      name="inherentRiskScore"
                      placeholder="Enter inherent risk score"
                      inputStyle={{ backgroundColor: inherentRiskScore?.inherentRiskScoreColor, fontWeight: 'bold' }}
                      readOnly
                    />
                  </Col>
                  <Col sm={24} md={6} xl={12}>
                    <InputItem
                      label="Residual Risk Score"
                      name="residualRiskScore"
                      placeholder="Enter residual risk score"
                      inputStyle={{ backgroundColor: residualRiskScore?.residualRiskScoreColor, fontWeight: 'bold' }}
                      readOnly
                    />
                  </Col>
                </Row>,
              }
            ]} 
          />
        </Form>
      </Col>
    </Row>
  </Spin>)
}