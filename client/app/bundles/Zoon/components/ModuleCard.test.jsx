import React from "react";
import renderer from "react-test-renderer";
import {shallow} from 'enzyme';

import ModuleCard from "./ModuleCard"

const module = {
  id: 1,
  family: "occurence",
  name: "My pretty module",
  version: "1.0",
  average_rating: 3,
  description: "It's just pretty.",
  tags: ["oh", "so", "pretty"],
}

describe("ModuleCard", () => {
  test("default usage", () => {
    const r = shallow(<ModuleCard m={module} link={true} />)

    expect(r.is("Link")).toBeTruthy()
    expect(r.props().to).toEqual(`/modules/${module.id}`)
  })

  test("onClick", () => {
    const cb = jest.fn()

    const r = shallow(<ModuleCard m={module} onClick={cb} />)
    expect(r.is("div")).toBeTruthy()

    r.simulate('click')
    expect(cb).toHaveBeenCalled()
  })

  test("no link", () => {
    const r = shallow(<ModuleCard m={module} />)

    expect(r.is("div")).toBeTruthy()
  })

  test("raise on link=true and onClick=something", () => {
    expect(
      () => shallow(<ModuleCard m={module} link={true} onClick={jest.fn()} />),
    ).toThrow()
  })
})
